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
import { selectOne, update } from 'zapatos/db';
import {
  CommonErrors,
  Config,
  getMediaMappedError,
  requestServiceAccountToken,
} from '../../common';
import { MediaTransactionalInboxMessageHandler } from '../../messaging';

/**
 * Every localization field will have this state set by default in the command
 * sent to the localization service.
 *
 * Feel free to change this value if the default should be different.
 */
export const DEFAULT_LOCALIZATION_STATE: EntityLocalizationFieldState =
  'APPROVED';

export class UpsertLocalizationSourceEntityFinishedHandler extends MediaTransactionalInboxMessageHandler<UpsertLocalizationSourceEntityFinishedEvent> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntityFinished,
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
    const token =
      metadata.authToken ?? (await requestServiceAccountToken(this.config));
    await this.storeOutboxMessage<LocalizeEntityCommand>(
      payload.entity_id,
      messageSettings,
      messagePayload,
      ownerClient,
      {
        envelopeOverrides: {
          auth_token: token,
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
  }

  public override mapError(error: unknown): Error {
    return getMediaMappedError(error, {
      message:
        'Processing of localizable source entity was successful, but there was an error updating the ingest item step status.',
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
    await update(
      'ingest_item_steps',
      {
        status: 'ERROR',
        response_message: error.message,
      },
      {
        ingest_item_id: messageContext.ingestItemId,
        type: 'LOCALIZATIONS',
      },
    ).run(ownerClient);
  }
}
