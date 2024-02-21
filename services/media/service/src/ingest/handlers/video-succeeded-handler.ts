import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  EnsureVideoExistsAlreadyExistedEvent,
  EnsureVideoExistsCreationStartedEvent,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  MediaServiceMessagingSettings,
  VideoMessageContext,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import { IsolationLevel, selectExactlyOne, update } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';
import { skipNonIngestEventsMiddleware } from '../middleware';
import { IngestEntityProcessor } from '../models';
import { getIngestErrorMessage } from '../utils/ingest-validation';

export abstract class VideoSucceededHandler<
  TContent extends
    | EnsureVideoExistsAlreadyExistedEvent
    | EnsureVideoExistsCreationStartedEvent,
> extends MediaGuardedMessageHandler<TContent> {
  constructor(
    private entityProcessors: IngestEntityProcessor[],
    messagingKey: string,
    private broker: Broker,
    private loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(messagingKey, ['INGESTS_EDIT', 'ADMIN'], config, overrides, [
      skipNonIngestEventsMiddleware(
        new Logger({ config, context: VideoSucceededHandler.name }),
      ),
    ]);
  }

  async onMessage(content: TContent, message: MessageInfo): Promise<void> {
    const messageContext = message.envelope
      .message_context as VideoMessageContext;

    const pgSettings = await this.getPgSettings(message);
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const ingestItem = await selectExactlyOne('ingest_items', {
          id: messageContext.ingestItemId,
        }).run(ctx);

        const processor = this.entityProcessors.find(
          (h) => h.type === ingestItem.type,
        );

        if (!processor) {
          throw new MosaicError({
            message: `Entity type '${ingestItem.type}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
            code: CommonErrors.IngestError.code,
          });
        }

        await processor.processVideo(
          ingestItem.entity_id,
          content.video_id,
          messageContext,
          ctx,
        );

        await update(
          'ingest_item_steps',
          { entity_id: content.video_id },
          { id: messageContext.ingestItemStepId },
        ).run(ctx);
      },
    );

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
    _content: TContent,
    message: MessageInfo,
    error: Error,
  ): Promise<void> {
    const messageContext = message.envelope
      .message_context as VideoMessageContext;

    await this.broker.publish<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: messageContext.ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: getIngestErrorMessage(
          error,
          'An unexpected error occurred while trying to update video relations.',
        ),
      },
      { auth_token: message.envelope.auth_token },
    );
  }
}
