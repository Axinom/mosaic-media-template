import {
  buildPgSettings,
  OwnerPgPool,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { GuardedContext } from '@axinom/mosaic-id-guard';
import {
  assertNotFalsy,
  Dict,
  Logger,
  MosaicError,
} from '@axinom/mosaic-service-common';
import {
  StoreInboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestDocumentCommand,
  IngestItem,
  MediaServiceMessagingSettings,
  StartIngestCommand,
  StartIngestItemCommand,
} from 'media-messages';
import { ClientBase } from 'pg';
import {
  IngestEntityExistsStatusEnum,
  IngestItemTypeEnum,
} from 'zapatos/custom';
import {
  insert,
  IsolationLevel,
  param,
  selectExactlyOne,
  self as value,
  SQL,
  sql,
  update,
} from 'zapatos/db';
import { ingest_items } from 'zapatos/schema';
import { CommonErrors, Config, PRIORITY_SEGMENT } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import {
  DisplayTitleMapping,
  IngestEntityProcessor,
  IngestItemInsertable,
  IngestMediaItem,
} from '../models';
import {
  getFutureIsoDateInMilliseconds,
  getIngestErrorMessage,
} from '../utils';

export class StartIngestHandler extends MediaGuardedTransactionalInboxMessageHandler<StartIngestCommand> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    private readonly storeInboxMessage: StoreInboxMessage,
    private readonly ownerPool: OwnerPgPool,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.StartIngest,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: StartIngestHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload, metadata }: TypedTransactionalMessage<StartIngestCommand>,
    ownerClient: ClientBase,
    { subject }: GuardedContext,
  ): Promise<void> {
    // Sending only id in a scenario of detached services is an anti-pattern
    // Ideally the whole doc should have been sent and message should be self-contained, but because doc has a potential to be quite big - we save it to db and pass only it's id
    const { document, id, started_count } = await selectExactlyOne(
      'ingest_documents',
      { id: payload.doc_id },
    ).run(ownerClient);

    // Establish the order by which items of specific type would be processed,
    // based on the order of entity processors.
    const orderedTypes: Dict<number> = this.entityProcessors.reduce<
      Dict<number>
    >((result, value, index) => {
      result[value.type] = index;
      return result;
    }, {});
    const notStartedItems: IngestItem[] = document.items.sort(
      (a, b) =>
        orderedTypes[a.type] - orderedTypes[b.type] ||
        a.external_id.localeCompare(b.external_id),
    );

    // Handle retries by skipping already processed items
    if (started_count > 0) {
      notStartedItems.splice(0, started_count);
    }

    const pgSettings = buildPgSettings(
      subject,
      this.config.dbOwner,
      this.config.serviceId,
    );
    const batchSize = 200;
    while (notStartedItems.length > 0) {
      const currentType = notStartedItems[0].type;
      const batch = notStartedItems
        .filter((item) => item.type === currentType)
        .splice(0, batchSize);
      notStartedItems.splice(0, batch.length);
      const processor = this.entityProcessors.find(
        (h) => h.type === currentType,
      );

      if (!processor) {
        throw new MosaicError({
          message: `Entity type '${currentType}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
          code: CommonErrors.IngestError.code,
        });
      }
      await transactionWithContext(
        this.ownerPool,
        IsolationLevel.Serializable,
        pgSettings,
        async (ctx) => {
          const ingestItems = await this.initializeItems(
            processor,
            batch,
            id,
            ctx,
          );

          await this.sendCommands(ingestItems, ctx, metadata.authToken);

          await update(
            'ingest_documents',
            { started_count: sql<SQL>`${value} + ${param(batch.length)}` },
            { id },
          ).run(ctx);

          if (notStartedItems.length === 0) {
            await this.storeInboxMessage<CheckFinishIngestDocumentCommand>(
              id.toString(),
              MediaServiceMessagingSettings.CheckFinishIngestDocument,
              {
                ingest_document_id: id,
                seconds_without_progress: 0,
                previous_error_count: 0,
                previous_success_count: 0,
                previous_in_progress_count: 0,
              },
              ctx,
              {
                metadata: { authToken: metadata.authToken },
                segment: PRIORITY_SEGMENT,
              },
            );
          }
        },
      );
    }
  }

  override async handleErrorMessage(
    error: Error,
    { payload }: TypedTransactionalMessage<StartIngestCommand>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const errorMessage = getIngestErrorMessage(
      error,
      'An error occurred while trying to initialize ingest items.',
    );
    await update(
      'ingest_documents',
      {
        status: 'ERROR',
        errors: [
          {
            message: errorMessage,
            source: StartIngestHandler.name,
          },
        ],
      },
      { id: payload.doc_id },
    ).run(ownerClient);
  }

  private async initializeItems(
    processor: IngestEntityProcessor,
    typedItems: IngestItem[],
    documentId: number,
    ownerClient: ClientBase,
  ): Promise<ingest_items.JSONSelectable[]> {
    const { existedMedia, createdMedia, displayTitleMappings } =
      await processor.initializeMedia(typedItems, ownerClient);

    const existedItems = this.createIngestItems(
      this.getIngestItemInfo(displayTitleMappings, existedMedia),
      typedItems,
      documentId,
      processor.type,
      'EXISTED',
    );

    let createdItems: ingest_items.Insertable[] = [];
    if (createdMedia.length > 0) {
      createdItems = this.createIngestItems(
        this.getIngestItemInfo(displayTitleMappings, createdMedia),
        typedItems,
        documentId,
        processor.type,
        'CREATED',
      );
    }
    return insert('ingest_items', [...existedItems, ...createdItems]).run(
      ownerClient,
    );
  }

  private getIngestItemInfo(
    displayTitleMappings: DisplayTitleMapping[],
    mediaItems: IngestMediaItem[],
  ): IngestItemInsertable[] {
    return mediaItems.map((item) => ({
      ...item,
      display_title:
        displayTitleMappings.find(
          (i) =>
            (i.external_id as string)?.toLowerCase() ===
            item.external_id?.toLowerCase(),
        )?.display_title ??
        item.external_id ??
        '',
    }));
  }

  private createIngestItems(
    entities: IngestItemInsertable[],
    ingestItems: IngestItem[],
    docId: number,
    type: IngestItemTypeEnum,
    status: IngestEntityExistsStatusEnum,
  ): ingest_items.Insertable[] {
    return entities.map<ingest_items.Insertable>(
      ({ id, external_id, display_title }) => {
        assertNotFalsy(external_id, `Ingest external_id`);
        const item = ingestItems.find(
          (i) => i.external_id.toLowerCase() === external_id.toLowerCase(),
        );

        assertNotFalsy(item, `Ingest item with external_id '${external_id}'`);

        return {
          ingest_document_id: docId,
          external_id,
          entity_id: id,
          exists_status: status,
          type,
          item,
          display_title,
        };
      },
    );
  }

  private async sendCommands(
    ingestItems: ingest_items.JSONSelectable[],
    ownerClient: ClientBase,
    jwtToken: string | undefined,
  ): Promise<void> {
    for (const ingestItem of ingestItems) {
      await this.storeInboxMessage<StartIngestItemCommand>(
        ingestItem.id.toString(),
        MediaServiceMessagingSettings.StartIngestItem,
        {
          ingest_item_id: ingestItem.id,
          entity_id: ingestItem.entity_id,
          item: ingestItem.item,
        },
        ownerClient,
        {
          metadata: { authToken: jwtToken },
          lockedUntil: getFutureIsoDateInMilliseconds(5_000),
        },
      );
    }
  }
}
