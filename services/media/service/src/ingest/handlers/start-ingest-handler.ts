import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { assertNotFalsy } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestDocumentCommand,
  IngestItem,
  MediaServiceMessagingSettings,
  StartIngestCommand,
  StartIngestItemCommand,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import {
  IngestEntityExistsStatusEnum,
  IngestItemTypeEnum,
} from 'zapatos/custom';
import {
  insert,
  IsolationLevel,
  selectExactlyOne,
  TxnClient,
  update,
} from 'zapatos/db';
import { ingest_items } from 'zapatos/schema';
import { Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';
import {
  DisplayTitleMapping,
  IngestEntityProcessor,
  IngestItemInsertable,
  IngestMediaItem,
} from '../models';
import { getIngestErrorMessage } from '../utils';

export class StartIngestHandler extends MediaGuardedMessageHandler<StartIngestCommand> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    private broker: Broker,
    private loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      MediaServiceMessagingSettings.StartIngest.messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
    );
  }

  public async onMessage(
    content: StartIngestCommand,
    message: MessageInfo,
  ): Promise<void> {
    const pgSettings = await this.getPgSettings(message);
    const ingestItems = await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        // Sending only id in a scenario of detached services is an anti-pattern
        // Ideally the whole doc should have been sent and message should be self-contained, but because doc has a potential to be quite big - we save it to db and pass only it's id
        const { document, id } = await selectExactlyOne('ingest_documents', {
          id: content.doc_id,
        }).run(ctx);

        const ingestItems: ingest_items.JSONSelectable[] = [];
        for (const processor of this.entityProcessors) {
          ingestItems.push(
            ...(await this.initializeItems(processor, document.items, id, ctx)),
          );
        }

        return ingestItems;
      },
    );

    await this.sendCommands(
      content.doc_id,
      ingestItems,
      message.envelope.auth_token,
    );
  }

  public async onMessageFailure(
    content: StartIngestCommand,
    message: MessageInfo,
    error: Error,
  ): Promise<void> {
    const pgSettings = await this.getPgSettings(message);
    const errorMessage = getIngestErrorMessage(
      error,
      'An error occurred while trying to initialize ingest items.',
    );
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
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
          { id: content.doc_id },
        ).run(ctx);
      },
    );
  }

  private async initializeItems(
    processor: IngestEntityProcessor,
    allItems: IngestItem[],
    documentId: number,
    ctx: TxnClient<IsolationLevel>,
  ): Promise<ingest_items.JSONSelectable[]> {
    const typedItems = allItems.filter(
      (item) => item.type.toLowerCase() === processor.type.toLowerCase(),
    );

    const { existedMedia, createdMedia, displayTitleMappings } =
      await processor.initializeMedia(typedItems, ctx);

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
    return insert('ingest_items', [...existedItems, ...createdItems]).run(ctx);
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
    jwtToken: string | undefined,
  ): Promise<void> {
    for (const ingestItem of ingestItems) {
      await this.broker.publish<StartIngestItemCommand>(
        ingestItem.id.toString(),
        MediaServiceMessagingSettings.StartIngestItem,
        {
          ingest_item_id: ingestItem.id,
          entity_id: ingestItem.entity_id,
          item: ingestItem.item,
        },
        { auth_token: jwtToken },
      );
    }

    await this.broker.publish<CheckFinishIngestDocumentCommand>(
      documentId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestDocument,
      {
        ingest_document_id: documentId,
        seconds_without_progress: 0,
        previous_error_count: 0,
        previous_success_count: 0,
        previous_in_progress_count: 0,
      },
      { auth_token: jwtToken },
    );
  }
}
