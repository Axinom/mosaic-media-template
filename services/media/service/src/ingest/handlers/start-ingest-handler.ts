import { assertNotFalsy, Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
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
import { insert, selectExactlyOne, update } from 'zapatos/db';
import { ingest_items } from 'zapatos/schema';
import { Config } from '../../common';
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

export class StartIngestHandler extends MediaGuardedTransactionalInboxMessageHandler<
  StartIngestCommand,
  Config
> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    private readonly storeOutboxMessage: StoreOutboxMessage,
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
    loginClient: ClientBase,
  ): Promise<void> {
    // Sending only id in a scenario of detached services is an anti-pattern
    // Ideally the whole doc should have been sent and message should be self-contained, but because doc has a potential to be quite big - we save it to db and pass only it's id
    const { document, id } = await selectExactlyOne('ingest_documents', {
      id: payload.doc_id,
    }).run(loginClient);

    const ingestItems: ingest_items.JSONSelectable[] = [];
    for (const processor of this.entityProcessors) {
      ingestItems.push(
        ...(await this.initializeItems(
          processor,
          document.items,
          id,
          loginClient,
        )),
      );
    }
    await this.sendCommands(
      payload.doc_id,
      ingestItems,
      loginClient,
      metadata.authToken,
    );
  }

  override async handleErrorMessage(
    error: Error,
    { payload }: TypedTransactionalMessage<StartIngestCommand>,
    loginClient: ClientBase,
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
    ).run(loginClient);
  }

  private async initializeItems(
    processor: IngestEntityProcessor,
    allItems: IngestItem[],
    documentId: number,
    loginClient: ClientBase,
  ): Promise<ingest_items.JSONSelectable[]> {
    const typedItems = allItems.filter(
      (item) => item.type.toLowerCase() === processor.type.toLowerCase(),
    );

    const { existedMedia, createdMedia, displayTitleMappings } =
      await processor.initializeMedia(typedItems, loginClient);

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
      loginClient,
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
    documentId: number,
    ingestItems: ingest_items.JSONSelectable[],
    loginClient: ClientBase,
    jwtToken: string | undefined,
  ): Promise<void> {
    for (const ingestItem of ingestItems) {
      await this.storeOutboxMessage<StartIngestItemCommand>(
        ingestItem.id.toString(),
        MediaServiceMessagingSettings.StartIngestItem,
        {
          ingest_item_id: ingestItem.id,
          entity_id: ingestItem.entity_id,
          item: ingestItem.item,
        },
        loginClient,
        {
          envelopeOverrides: { auth_token: jwtToken },
          lockedUntil: getFutureIsoDateInMilliseconds(5_000),
        },
      );
    }

    await this.storeOutboxMessage<CheckFinishIngestDocumentCommand>(
      documentId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestDocument,
      {
        ingest_document_id: documentId,
        seconds_without_progress: 0,
        previous_error_count: 0,
        previous_success_count: 0,
        previous_in_progress_count: 0,
      },
      loginClient,
      { envelopeOverrides: { auth_token: jwtToken } },
    );
  }
}
