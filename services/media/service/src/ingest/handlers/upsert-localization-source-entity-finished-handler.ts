import {
  EntityLocalization,
  EntityLocalizationFieldState,
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityCommand,
  UpsertLocalizationSourceEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { IngestLocalization, IngestMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { param, selectOne, self as value, SQL, sql, update } from 'zapatos/db';
import { CommonErrors, Config, getMediaMappedError } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';

/**
 * Every localization field will have this state set by default in the command
 * sent to the localization service.
 *
 * Feel free to change this value if the default should be different.
 */
export const DEFAULT_LOCALIZATION_STATE: EntityLocalizationFieldState =
  'APPROVED';

export class UpsertLocalizationSourceEntityFinishedHandler extends MediaGuardedTransactionalInboxMessageHandler<UpsertLocalizationSourceEntityFinishedEvent> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFinished,
      ['INGEST_EDITOR', 'ADMIN'],
      new Logger({
        config,
        context: UpsertLocalizationSourceEntityFinishedHandler.name,
      }),
      config,
    );
  }
  override async handleMessage(
    {
      payload,
      metadata,
    }: TypedTransactionalMessage<UpsertLocalizationSourceEntityFinishedEvent>,
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

    const ingestItem = await selectOne(
      'ingest_items',
      { id: messageContext.ingestItemId },
      { columns: ['item'] },
    ).run(ownerClient);
    const localizationStep = await selectOne(
      'ingest_item_steps',
      {
        ingest_item_id: messageContext.ingestItemId,
        type: 'LOCALIZATIONS',
      },
      { columns: ['id'] },
    ).run(ownerClient);

    if (!ingestItem || !localizationStep) {
      throw new MosaicError({
        message: `Unable to find existing Ingest Item with ID '${messageContext.ingestItemId}' or related Ingest Item Step with type 'LOCALIZATIONS'.`,
        code: CommonErrors.IngestError.code,
      });
    }

    const inputLocalizations = ingestItem.item.data
      .localizations as IngestLocalization[];

    /**
     * There's a scenario where the Localization step will still exist even with no input localizations
     * if the ingest document contains only image localizations.
     * In this case, we need to update the step status to 'SUCCESS' and skip sending the message to the localization service
     * since the LocalizeEntity command for image localizations are sent through LocalizableImageIngestFinishedHandler.
     */
    if (inputLocalizations !== undefined && inputLocalizations.length > 0) {
      const localizations: EntityLocalization[] = inputLocalizations.flatMap(
        ({ language_tag, ...fields }) => ({
          language_tag,
          fields: Object.keys(fields).map((key) => ({
            field_name: key,
            field_value: fields[key] as string,
            state: DEFAULT_LOCALIZATION_STATE,
          })),
        }),
      );

      const messageSettings =
        LocalizationServiceMultiTenantMessagingSettings.LocalizeEntity;
      const messagePayload: LocalizeEntityCommand = {
        service_id: this.config.serviceId,
        entity_type: payload.entity_type,
        entity_id: payload.entity_id,
        localizations,
      };

      const localizationMessageContext: IngestMessageContext = {
        ingestItemId: messageContext.ingestItemId,
        ingestItemStepId: localizationStep.id,
      };

      await this.storeOutboxMessage<LocalizeEntityCommand>(
        payload.entity_id,
        messageSettings,
        messagePayload,
        ownerClient,
        {
          envelopeOverrides: {
            auth_token: metadata.authToken,
            message_context: localizationMessageContext,
          },
          options: {
            routingKey: messageSettings.getEnvironmentRoutingKey({
              tenantId: this.config.tenantId,
              environmentId: this.config.environmentId,
            }),
          },
        },
      );
    } else {
      await update(
        'ingest_item_steps',
        { status: 'SUCCESS' },
        { id: localizationStep.id },
      ).run(ownerClient);
    }
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
    }: TypedTransactionalMessage<UpsertLocalizationSourceEntityFinishedEvent>,
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
      source: UpsertLocalizationSourceEntityFinishedHandler.name,
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
