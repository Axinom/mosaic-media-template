import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityFailedEvent,
} from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  CheckFinishIngestItemCommand,
  IngestMessageContext,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { SubscriptionConfig } from 'rascal';
import {
  IsolationLevel,
  param,
  selectOne,
  self as value,
  SQL,
  sql,
  update,
} from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaGuardedMessageHandler } from '../../messaging';

export class UpsertLocalizationSourceEntityFailedHandler extends MediaGuardedMessageHandler<UpsertLocalizationSourceEntityFailedEvent> {
  constructor(
    private broker: Broker,
    private loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      LocalizationServiceMultiTenantMessagingSettings
        .UpsertLocalizationSourceEntityFailed.messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
    );
  }

  async onMessage(
    content: UpsertLocalizationSourceEntityFailedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const messageContext = message.envelope.message_context as Pick<
      IngestMessageContext,
      'ingestItemId'
    >;
    if (
      !messageContext?.ingestItemId ||
      content.service_id !== this.config.serviceId
    ) {
      // skipping message without ingest context or from different service
      return;
    }

    const pgSettings = await this.getPgSettings(message);
    const ingestItemStepId = await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const localizationStep = await selectOne(
          'ingest_item_steps',
          {
            ingest_item_id: messageContext.ingestItemId,
            type: 'LOCALIZATIONS',
          },
          { columns: ['id'] },
        ).run(ctx);
        return localizationStep?.id;
      },
    );

    if (!ingestItemStepId) {
      throw new MosaicError({
        message: `Unable to find existing Ingest Item Step with type 'LOCALIZATIONS' for Ingest Item with ID '${messageContext.ingestItemId}'.`,
        code: CommonErrors.IngestError.code,
      });
    }

    await this.broker.publish<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: ingestItemStepId,
        ingest_item_id: messageContext.ingestItemId,
        error_message: content.message,
      },
      { auth_token: message.envelope.auth_token },
    );
  }

  public mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message:
        'An error occurred while trying to process a response event from the localization service.',
      code: CommonErrors.IngestError.code,
    });
  }

  public async onMessageFailure(
    _content: UpsertLocalizationSourceEntityFailedEvent,
    message: MessageInfo,
    finalError: Error,
  ): Promise<void> {
    const messageContext = message.envelope.message_context as Pick<
      IngestMessageContext,
      'ingestItemId'
    >;
    const pgSettings = await this.getPgSettings(message);
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const error = param({
          message: finalError.message,
          source: UpsertLocalizationSourceEntityFailedHandler.name,
        });
        await update(
          'ingest_items',
          {
            status: 'ERROR',
            errors: sql<SQL>`${value} || ${error}::jsonb`,
          },
          { id: messageContext.ingestItemId },
        ).run(ctx);
      },
    );
  }
}
