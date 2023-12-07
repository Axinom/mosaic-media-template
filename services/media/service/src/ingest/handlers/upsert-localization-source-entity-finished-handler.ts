import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  EntityLocalization,
  EntityLocalizationFieldState,
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityCommand,
  UpsertLocalizationSourceEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import { IngestLocalization, IngestMessageContext } from 'media-messages';
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

/**
 * Every localization field will have this state set by default in the command
 * sent to the localization service.
 *
 * Feel free to change this value if the default should be different.
 */
export const DEFAULT_LOCALIZATION_STATE: EntityLocalizationFieldState =
  'APPROVED';

export class UpsertLocalizationSourceEntityFinishedHandler extends MediaGuardedMessageHandler<UpsertLocalizationSourceEntityFinishedEvent> {
  constructor(
    private broker: Broker,
    private loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      LocalizationServiceMultiTenantMessagingSettings
        .UpsertLocalizationSourceEntityFinished.messageType,
      ['INGESTS_EDIT', 'ADMIN'],
      config,
      overrides,
    );
  }

  async onMessage(
    content: UpsertLocalizationSourceEntityFinishedEvent,
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
      // skipping message without ingest context or for entity types from different services
      return;
    }

    const pgSettings = await this.getPgSettings(message);
    const { ingestItem, localizationStep } = await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      pgSettings,
      async (ctx) => {
        const ingestItem = await selectOne(
          'ingest_items',
          { id: messageContext.ingestItemId },
          { columns: ['item'] },
        ).run(ctx);
        const localizationStep = await selectOne(
          'ingest_item_steps',
          {
            ingest_item_id: messageContext.ingestItemId,
            type: 'LOCALIZATIONS',
          },
          { columns: ['id'] },
        ).run(ctx);
        return { ingestItem, localizationStep };
      },
    );

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
      entity_type: content.entity_type,
      entity_id: content.entity_id,
      localizations,
    };

    const localizationMessageContext: IngestMessageContext = {
      ingestItemId: messageContext.ingestItemId,
      ingestItemStepId: localizationStep.id,
    };

    await this.broker.publish<LocalizeEntityCommand>(
      content.entity_id,
      messageSettings,
      messagePayload,
      {
        auth_token: message.envelope.auth_token,
        message_context: localizationMessageContext,
      },
      {
        routingKey: messageSettings.getEnvironmentRoutingKey({
          tenantId: this.config.tenantId,
          environmentId: this.config.environmentId,
        }),
      },
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
    _content: UpsertLocalizationSourceEntityFinishedEvent,
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
          source: UpsertLocalizationSourceEntityFinishedHandler.name,
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
