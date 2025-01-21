import {
  EntityLocalization,
  LocalizationServiceMultiTenantMessagingSettings,
  LocalizeEntityCommand,
} from '@axinom/mosaic-messages';
import { groupBy, Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ImageIngestData,
  ImageLocalizationMessageContext,
  IngestItemType,
  LocalizableImageIngestFinishedEvent,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { select, selectExactlyOne, selectOne } from 'zapatos/db';
import { Config, requestServiceAccountToken } from '../../common';
import { LOCALIZATION_COLLECTION_TYPE } from '../../domains/collections';
import { LOCALIZATION_MOVIE_TYPE } from '../../domains/movies/localization/constants';
import {
  LOCALIZATION_EPISODE_TYPE,
  LOCALIZATION_SEASON_TYPE,
  LOCALIZATION_TVSHOW_TYPE,
} from '../../domains/tvshows';
import { MediaTransactionalInboxMessageHandler } from '../../messaging';
import { DEFAULT_LOCALIZATION_STATE } from './upsert-localization-source-entity-finished-handler';

export class LocalizableImageIngestFinishedHandler extends MediaTransactionalInboxMessageHandler<LocalizableImageIngestFinishedEvent> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      MediaServiceMessagingSettings.LocalizableImageIngestFinished,
      new Logger({
        config,
        context: LocalizableImageIngestFinishedHandler.name,
      }),
      config,
    );
  }
  override async handleMessage(
    { payload }: TypedTransactionalMessage<LocalizableImageIngestFinishedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const ingestItem = await selectOne('ingest_items', {
      id: payload.ingest_item_id,
    }).run(ownerClient);

    const ingestItemEntityStep = await selectExactlyOne('ingest_item_steps', {
      ingest_item_id: payload.ingest_item_id,
      type: 'ENTITY',
    }).run(ownerClient);

    const imageLocalizationSteps = await select('ingest_item_steps', {
      ingest_item_id: payload.ingest_item_id,
      type: 'IMAGE_LOCALIZATIONS',
      status: 'IN_PROGRESS',
    }).run(ownerClient);

    if (ingestItem === undefined) {
      // mark the image localization step as error
      throw new MosaicError({
        code: 'IngestItemNotFound',
        message: `Ingest document with ID ${payload.ingest_item_id} not found`,
      });
    }

    const localizableImages = (
      ingestItem.item.data.images as ImageIngestData[]
    )?.filter((img) => img.language_tag !== undefined);

    if (localizableImages !== undefined && localizableImages.length > 0) {
      const groupedLocalizableImages = groupBy(
        localizableImages,
        'language_tag',
      );

      let localizations: EntityLocalization[] = [];

      for (const [languageTag, images] of Object.entries(
        groupedLocalizableImages,
      )) {
        const localization: EntityLocalization = {
          language_tag: languageTag,
          fields: [],
        };
        for (const image of images) {
          const localizedImage = await selectOne('ingest_item_steps', {
            ingest_item_id: payload.ingest_item_id,
            type: 'IMAGE',
            language_tag: image.language_tag,
            sub_type: image.type,
          }).run(ownerClient);

          if (localizedImage && localizedImage.entity_id) {
            localization.fields.push({
              field_name: this.buildLocalizationFieldId(image.type),
              field_value: localizedImage.entity_id,
              state: DEFAULT_LOCALIZATION_STATE,
            });
          }
        }
        localizations.push(localization);
      }

      const messageSettings =
        LocalizationServiceMultiTenantMessagingSettings.LocalizeEntity;
      const messagePayload: LocalizeEntityCommand = {
        service_id: this.config.serviceId,
        entity_type: this.getLocalizationEntityType(ingestItem.type),
        entity_id: ingestItemEntityStep.entity_id!,
        localizations,
      };

      const localizationMessageContext: ImageLocalizationMessageContext = {
        ingestItemId: payload.ingest_item_id,
        ingestItemStepId: imageLocalizationSteps[0].id, // this is not used for Image Localizations in the LocalizeEntityFinishedHandler. Instead ingestItemStepIds is used.
        isImageLocalization: true,
        ingestItemStepIds: imageLocalizationSteps.map((step) => step.id),
      };

      const accessToken = await requestServiceAccountToken(this.config);

      await this.storeOutboxMessage<LocalizeEntityCommand>(
        ingestItemEntityStep.entity_id!,
        messageSettings,
        messagePayload,
        ownerClient,
        {
          envelopeOverrides: {
            auth_token: accessToken,
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
  }

  /**
   * This method builds the localization field id for the image type
   * i.e. when the image type is `MOVIE_COVER_1x1`, the field id will be `movie_cover_1x1`
   *
   * @param imageType
   * @returns
   */
  private buildLocalizationFieldId(imageType: string): string {
    return `${imageType.toLowerCase()}`;
  }

  private getLocalizationEntityType(ingestItemType: IngestItemType): string {
    switch (ingestItemType) {
      case 'MOVIE':
        return LOCALIZATION_MOVIE_TYPE;
      case 'TVSHOW':
        return LOCALIZATION_TVSHOW_TYPE;
      case 'SEASON':
        return LOCALIZATION_SEASON_TYPE;
      case 'EPISODE':
        return LOCALIZATION_EPISODE_TYPE;
      case 'COLLECTION':
        return LOCALIZATION_COLLECTION_TYPE;
      default:
        throw new MosaicError({
          code: 'UnsupportedImageLocalizationIngestItemType',
          message: `Unsupported image localization ingest item type ${ingestItemType}`,
        });
    }
  }
}
