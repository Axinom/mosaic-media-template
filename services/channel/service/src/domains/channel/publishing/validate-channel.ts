import { LocalizationServiceMessagingSettings } from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import { ChannelLocalization, ChannelPublishedEvent } from 'media-messages';
import Hasher from 'node-object-hash';
import { ClientBase } from 'pg';
import { select } from 'zapatos/db';
import {
  CommonErrors,
  Config,
  isManagedServiceEnabled,
  LOCALIZATION_CHANNEL_TYPE,
} from '../../../common';
import {
  getValidationAndImages,
  getValidationAndVideos,
} from '../../../publishing/common';
import {
  getChannelValidationAndLocalizations,
  getDefaultChannelLocalization,
} from '../../../publishing/common/localization';
import {
  calculateValidationStatus,
  PublishValidationMessage,
  PublishValidationResult,
} from '../../../publishing/models';
import { aggregateChannelPublishDto } from './aggregate-channel-publish-dto';
import { createChannelPublishPayload } from './create-channel-publish-payload';

const hasher = Hasher();

export async function validateChannel(
  id: string,
  jwtToken: string,
  gqlClient: ClientBase,
  config: Config,
): Promise<PublishValidationResult<ChannelPublishedEvent>> {
  const validations: PublishValidationMessage[] = [];
  const publishDto = await aggregateChannelPublishDto(id, gqlClient);

  if (publishDto === undefined) {
    throw new MosaicError({
      ...CommonErrors.ChannelNotFound,
      details: { channelId: id },
    });
  }

  const image_rows = await select(
    'channel_images',
    { channel_id: id },
    { columns: ['image_id'] },
  ).run(gqlClient);

  const [
    { images, validations: imageValidations },
    { videos, validations: videoValidations },
    isLocalizationServiceEnabled,
  ] = await Promise.all([
    getValidationAndImages(
      config.imageServiceBaseUrl,
      jwtToken,
      image_rows.map((ci) => ci.image_id),
      true,
    ),
    getValidationAndVideos(
      config.videoServiceBaseUrl,
      jwtToken,
      publishDto.placeholder_video_id
        ? [{ videoId: publishDto.placeholder_video_id }]
        : [],
      publishDto.is_drm_protected,
      true,
    ),
    isManagedServiceEnabled(
      LocalizationServiceMessagingSettings.LocalizationServiceEnable.serviceId,
      config,
      jwtToken,
      false,
    ),
  ]);

  validations.push(...imageValidations, ...videoValidations);

  let localizationsToPublish: ChannelLocalization[];
  // Skip requests to the localization service if it is not enabled for the environment
  if (isLocalizationServiceEnabled && config.isLocalizationEnabled) {
    const { localizations, validations: localizationValidations } =
      await getChannelValidationAndLocalizations(
        config.localizationServiceBaseUrl,
        jwtToken,
        id,
        LOCALIZATION_CHANNEL_TYPE,
        config.serviceId,
      );
    localizationsToPublish = localizations ?? [];
    validations.push(...localizationValidations);
  } else {
    localizationsToPublish = [
      getDefaultChannelLocalization(publishDto.title, publishDto.description),
    ];
  }

  // transform the dto to a publish message
  const publishPayload = createChannelPublishPayload(
    publishDto,
    images,
    videos[0] ?? undefined,
    localizationsToPublish,
  );

  const validationStatus = calculateValidationStatus(validations);
  const publishHash = hasher.hash(publishPayload);

  return {
    publishPayload,
    validations,
    publishHash,
    validationStatus,
  };
}
