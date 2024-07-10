import {
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityCommand,
} from '@axinom/mosaic-messages';
import {
  MosaicError,
  MosaicErrorInfo,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { GraphQLClient } from 'graphql-request';
import { MediaServiceMessagingSettings } from 'media-messages';
import { ClientBase } from 'pg';
import urljoin from 'url-join';
import { parent, selectExactlyOne, selectOne } from 'zapatos/db';
import {
  CommonErrors,
  Config,
  LOCALIZATION_PROGRAM_TYPE,
} from '../../../common';
import { getSdk } from '../../../generated/graphql/localization';
import {
  getLocalizationDeleteMessageData,
  getLocalizationUpsertMessageData,
  LocalizableTransactionalInboxMessageHandler,
  LocalizationMessageData,
} from '../../../localization';
import { LocalizableProgramDbMessagingSettings } from './localizable-program-db-messaging-settings';

export interface LocalizableProgramDbEvent {
  id: string;
  title?: string;
  image_id?: string;
}

const getLocalizationMappedError = mosaicErrorMappingFactory(
  (
    error: Error & { code?: string; response?: { errors?: MosaicErrorInfo[] } },
  ) => {
    if (error?.code === 'ECONNREFUSED') {
      return {
        ...CommonErrors.ServiceNotAccessible,
        messageParams: ['Localization'],
      };
    }

    if (error.response?.errors) {
      return {
        ...CommonErrors.UnableToGetMediaLocalizations,
        details: {
          errors: error.response?.errors,
        },
      };
    }

    return CommonErrors.UnableToGetMediaLocalizations;
  },
);

const getSourceTitle = async (
  id: string,
  ownerClient: ClientBase,
  fields: { title?: string | undefined },
): Promise<string> => {
  const program = await selectOne(
    'programs',
    { id },
    {
      lateral: {
        playlist: selectExactlyOne(
          'playlists',
          {
            id: parent('playlist_id'),
          },
          {
            columns: ['start_date_time'],
            lateral: {
              channel: selectExactlyOne(
                'channels',
                {
                  id: parent('channel_id'),
                },
                { columns: ['title'] },
              ),
            },
          },
        ),
      },
    },
  ).run(ownerClient);
  if (!program) {
    throw new MosaicError(
      `Could not find the program "${fields.title}" with ID "${id}".`,
    );
  }
  return `${fields.title} (${program.playlist.start_date_time.substring(
    0,
    10,
  )} - ${program.playlist.channel.title})`;
};

export class LocalizableProgramCreatedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableProgramDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableProgramDbMessagingSettings.LocalizableProgramCreated,
      storeOutboxMessage,
      config,
    );
  }

  override async additionalWork(
    message: TypedTransactionalMessage<LocalizableProgramDbEvent>,
    ownerClient: ClientBase,
    accessToken: string,
  ): Promise<void> {
    const programId = message.payload.id;
    const program = await selectOne('programs', { id: programId }).run(
      ownerClient,
    );
    if (!program) {
      throw new MosaicError(
        `Could not find the program "${
          message.payload.title ?? 'unknown'
        }" with ID "${message.payload.id}".`,
      );
    }

    const entityId = program.entity_id;
    const entityType = program.entity_type.toLocaleLowerCase();
    try {
      const client = new GraphQLClient(
        urljoin(this.config.localizationServiceBaseUrl, 'graphql'),
      );
      const { MediaLocalizations } = getSdk(client);
      const { data } = await MediaLocalizations(
        {
          entityId,
          entityType,
          serviceId: MediaServiceMessagingSettings.PublishEntity.serviceId, // any setting to get the Media Service ID
        },
        { Authorization: `Bearer ${accessToken}` },
      );
      if (data.localizedEntities && data.localizedEntities.nodes.length > 0) {
        const shortDelay = new Date();
        shortDelay.setMilliseconds(shortDelay.getMilliseconds() + 100);
        await this.storeOutboxMessage<LocalizeEntityCommand>(
          programId,
          LocalizationServiceMultiTenantMessagingSettings.LocalizeEntity,
          {
            entity_id: programId,
            entity_type: LOCALIZATION_PROGRAM_TYPE,
            localizations: data.localizedEntities.nodes.map((m) => {
              const localizedMediaTitle = m.fields?.find(
                (f) => f?.fieldName === 'title',
              );
              return {
                language_tag: m.languageTag,
                fields: [
                  {
                    field_name: 'title',
                    field_value: localizedMediaTitle?.fieldValue,
                    state: localizedMediaTitle?.state ?? 'UNTRANSLATED',
                  },
                ],
              };
            }),
            service_id: this.config.serviceId,
          },
          ownerClient,
          {
            lockedUntil: shortDelay.toISOString(),
            envelopeOverrides: {
              auth_token: accessToken,
            },
            options: {
              routingKey:
                LocalizationServiceMultiTenantMessagingSettings.LocalizeEntity.getEnvironmentRoutingKey(
                  {
                    tenantId: this.config.tenantId,
                    environmentId: this.config.environmentId,
                  },
                ),
            },
          },
        );
      }
    } catch (e) {
      throw getLocalizationMappedError(e);
    }
  }

  override async getLocalizationCommandData(
    {
      payload: { id, image_id, ...fields },
    }: TypedTransactionalMessage<LocalizableProgramDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    const sourceTitle = await getSourceTitle(id, ownerClient, fields);
    return getLocalizationUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_PROGRAM_TYPE,
      id,
      fields,
      sourceTitle,
      image_id,
    );
  }
}

export class LocalizableProgramUpdatedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableProgramDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableProgramDbMessagingSettings.LocalizableProgramUpdated,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData(
    {
      payload: { id, image_id, ...fields },
    }: TypedTransactionalMessage<LocalizableProgramDbEvent>,
    ownerClient: ClientBase,
  ): Promise<LocalizationMessageData | undefined> {
    const sourceTitle = await getSourceTitle(id, ownerClient, fields);
    return getLocalizationUpsertMessageData(
      this.config.serviceId,
      LOCALIZATION_PROGRAM_TYPE,
      id,
      fields,
      sourceTitle,
      image_id,
    );
  }
}

export class LocalizableProgramDeletedDbMessageHandler extends LocalizableTransactionalInboxMessageHandler<LocalizableProgramDbEvent> {
  constructor(storeOutboxMessage: StoreOutboxMessage, config: Config) {
    super(
      LocalizableProgramDbMessagingSettings.LocalizableProgramDeleted,
      storeOutboxMessage,
      config,
    );
  }

  override async getLocalizationCommandData({
    payload: { id },
  }: TypedTransactionalMessage<LocalizableProgramDbEvent>): Promise<
    LocalizationMessageData | undefined
  > {
    return getLocalizationDeleteMessageData(
      this.config.serviceId,
      LOCALIZATION_PROGRAM_TYPE,
      id,
    );
  }
}
