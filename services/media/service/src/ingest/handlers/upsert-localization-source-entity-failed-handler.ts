import {
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckFinishIngestItemCommand,
  IngestMessageContext,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { param, selectOne, self as value, SQL, sql, update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';

export class UpsertLocalizationSourceEntityFailedHandler extends MediaGuardedTransactionalInboxMessageHandler<UpsertLocalizationSourceEntityFailedEvent> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFailed,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: UpsertLocalizationSourceEntityFailedHandler.name,
      }),
      config,
    );
  }
  override async handleMessage(
    {
      payload,
      metadata,
    }: TypedTransactionalMessage<UpsertLocalizationSourceEntityFailedEvent>,
    loginClient: ClientBase,
  ): Promise<void> {
    const messageContext = metadata.messageContext as Pick<
      IngestMessageContext,
      'ingestItemId'
    >;
    if (
      !messageContext?.ingestItemId ||
      payload.service_id !== this.config.serviceId
    ) {
      // skipping message without ingest context or for entity types from different services
      return;
    }

    const localizationStep = await selectOne(
      'ingest_item_steps',
      {
        ingest_item_id: messageContext.ingestItemId,
        type: 'LOCALIZATIONS',
      },
      { columns: ['id'] },
    ).run(loginClient);

    if (!localizationStep?.id) {
      throw new MosaicError({
        message: `Unable to find existing Ingest Item Step with type 'LOCALIZATIONS' for Ingest Item with ID '${messageContext.ingestItemId}'.`,
        code: CommonErrors.IngestError.code,
      });
    }

    await this.storeOutboxMessage<CheckFinishIngestItemCommand>(
      messageContext.ingestItemId.toString(),
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      {
        ingest_item_step_id: localizationStep?.id,
        ingest_item_id: messageContext.ingestItemId,
        error_message: payload.message,
      },
      loginClient,
      { envelopeOverrides: { auth_token: metadata.authToken } },
    );
  }

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message:
        'An error occurred while trying to process a response event from the localization service.',
      code: CommonErrors.IngestError.code,
    });
  }

  override async handleErrorMessage(
    error: Error,
    {
      metadata,
    }: TypedTransactionalMessage<UpsertLocalizationSourceEntityFailedEvent>,
    loginClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const messageContext = metadata.messageContext as Pick<
      IngestMessageContext,
      'ingestItemId'
    >;
    const err = param({
      message: error.message,
      source: UpsertLocalizationSourceEntityFailedHandler.name,
    });
    await update(
      'ingest_items',
      {
        status: 'ERROR',
        errors: sql<SQL>`${value} || ${err}::jsonb`,
      },
      { id: messageContext.ingestItemId },
    ).run(loginClient);
  }
}
