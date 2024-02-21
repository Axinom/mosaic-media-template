import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  IngestMessageContext,
  MediaServiceMessagingSettings,
  UpdateMetadataCommand,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import { IsolationLevel } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';
import { IngestEntityProcessor } from '../models';
import { getIngestErrorMessage } from '../utils/ingest-validation';

export class UpdateMetadataHandler extends MediaGuardedMessageHandler<UpdateMetadataCommand> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    private broker: Broker,
    private loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      MediaServiceMessagingSettings.UpdateMetadata.messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
    );
  }

  async onMessage(
    content: UpdateMetadataCommand,
    message: MessageInfo,
  ): Promise<void> {
    const pgSettings = await this.getPgSettings(message);
    await transactionWithContext(
      this.loginPool,
      // Serializable is not used here to avoid transaction error retries.
      // Errors happen because of concurrent updates to relation tables, e.g. movies_tags
      // Because updates are targeted and limited to inserts or deletes, there
      // should be no problems with using RepeatableRead.
      IsolationLevel.RepeatableRead,
      pgSettings,
      async (ctx) => {
        const processor = this.entityProcessors.find(
          (h) => h.type === content.item.type,
        );

        if (!processor) {
          throw new MosaicError({
            message: `Entity type '${content.item.type}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
            code: CommonErrors.IngestError.code,
          });
        }

        await processor.updateMetadata(content, ctx);
      },
    );

    const messageContext = message.envelope
      .message_context as IngestMessageContext;
    await this.broker.publish<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
      },
      { auth_token: message.envelope.auth_token },
    );
  }

  public async onMessageFailure(
    _content: UpdateMetadataCommand,
    message: MessageInfo,
    error: Error,
  ): Promise<void> {
    const messageContext = message.envelope
      .message_context as IngestMessageContext;
    await this.broker.publish<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: getIngestErrorMessage(
          error,
          'Unexpected error occurred while updating metadata.',
        ),
      },
      { auth_token: message.envelope.auth_token },
    );
  }
}
