import {
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { IngestMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { param, selectOne, self as value, SQL, sql, update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaTransactionalInboxMessageHandler } from '../../messaging';

export class UpsertLocalizationSourceEntityFailedHandler extends MediaTransactionalInboxMessageHandler<UpsertLocalizationSourceEntityFailedEvent> {
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFailed,
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
    ownerClient: ClientBase,
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
    ).run(ownerClient);

    if (!localizationStep?.id) {
      throw new MosaicError({
        message: `Unable to find existing Ingest Item Step with type 'LOCALIZATIONS' for Ingest Item with ID '${messageContext.ingestItemId}'.`,
        code: CommonErrors.IngestError.code,
      });
    }

    await update(
      'ingest_item_steps',
      {
        status: 'ERROR',
        response_message: payload.message,
      },
      { id: localizationStep.id },
    ).run(ownerClient);
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
    ownerClient: ClientBase,
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
    ).run(ownerClient);
  }
}
