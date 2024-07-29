import { LocalizationServiceMessagingSettings } from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import { DetailedVideo, PlaylistPublishedEvent } from 'media-messages';
import Hasher from 'node-object-hash';
import { ClientBase } from 'pg';
import { selectExactlyOne } from 'zapatos/db';
import {
  CommonErrors,
  Config,
  isManagedServiceEnabled,
  LOCALIZATION_PROGRAM_TYPE,
  ValidationErrors,
} from '../../../common';
import {
  getValidationAndImages,
  getValidationAndVideos,
  SelectedVideo,
} from '../../../publishing';
import { getProgramValidationAndLocalizations } from '../../../publishing/common/localization';
import {
  calculateValidationStatus,
  createValidationError,
  createValidationWarning,
  PublishValidationMessage,
  PublishValidationResult,
} from '../../../publishing/models';
import { PublishValidationContextEnum } from '../../../publishing/models/publish-validation-message';
import {
  aggregatePlaylistPublishDto,
  LocalizedPlaylistPublishDto,
  PlaylistPublishDto,
} from './aggregate-playlist-publish-dto';
import { createPlaylistPublishPayload } from './create-playlist-publish-payload';

const hasher = Hasher();

export async function validatePlaylist(
  id: string,
  jwtToken: string,
  gqlClient: ClientBase,
  config: Config,
): Promise<PublishValidationResult<PlaylistPublishedEvent>> {
  const validations: PublishValidationMessage[] = [];

  const publishDto = await aggregatePlaylistPublishDto(id, gqlClient);
  if (publishDto === undefined) {
    throw new MosaicError({
      ...CommonErrors.PlaylistNotFound,
      details: { playlistId: id },
    });
  }

  const channel = await selectExactlyOne(
    'channels',
    { id: publishDto.channel_id },
    {
      columns: [
        'id',
        'publication_state',
        'placeholder_video_id',
        'is_drm_protected',
      ],
    },
  ).run(gqlClient);

  if (channel?.publication_state !== 'PUBLISHED') {
    validations.push(
      createValidationError(
        ValidationErrors.AssociatedChannelNotPublished.message,
        'METADATA',
      ),
    );
  }

  const imagesIds: string[] = [];
  const selectedVideos: SelectedVideo[] = [];

  publishDto.programs.map((pr) => {
    if (pr.image_id) {
      imagesIds.push(pr.image_id);
    }
    selectedVideos.push({
      videoId: pr.video_id,
      source: `The video is used for the program "${pr.title}".`,
    });
    pr.program_cue_points
      .flatMap((cp) => cp.cue_point_schedules)
      .map((s, index) => {
        if (s.video_id) {
          selectedVideos.push({
            videoId: s.video_id,
            source: `The video is assigned as the item number ${
              index + 1
            } of the program "${pr.title}".`,
          });
        }
      });
  });

  if (config.playlistShouldBe24Hours && channel.placeholder_video_id) {
    selectedVideos.push({
      videoId: channel.placeholder_video_id,
      source: 'The video is the channel placeholder video.',
    });
  }

  const [
    { images, validations: imageValidations },
    { videos, validations: videoValidations },
    isLocalizationServiceEnabled,
  ] = await Promise.all([
    getValidationAndImages(
      config.imageServiceBaseUrl,
      jwtToken,
      imagesIds,
      false,
    ),
    getValidationAndVideos(
      config.videoServiceBaseUrl,
      jwtToken,
      selectedVideos,
      channel.is_drm_protected,
      false,
    ),
    isManagedServiceEnabled(
      LocalizationServiceMessagingSettings.LocalizationServiceEnable.serviceId,
      config,
      jwtToken,
    ),
  ]);
  validations.push(
    ...imageValidations,
    ...videoValidations,
    ...validatePlaylistMetadata(publishDto, videos, config),
  );

  const localizedPublishDto = publishDto as LocalizedPlaylistPublishDto;
  for (const program of localizedPublishDto.programs) {
    // Skip requests to the localization service if it is not enabled for the environment
    if (isLocalizationServiceEnabled && config.isLocalizationEnabled) {
      const { localizations, validations: localizationValidations } =
        await getProgramValidationAndLocalizations(
          config.localizationServiceBaseUrl,
          jwtToken,
          program.id,
          LOCALIZATION_PROGRAM_TYPE,
          config.serviceId,
          program.title,
        );

      program.localizations = localizations ?? [];
      validations.push(...localizationValidations);
    } else {
      program.localizations = [
        {
          is_default_locale: true,
          language_tag: 'default',
          title: program.title,
        },
      ];
    }
  }

  // transform the dto to a publish message
  const publishPayload = createPlaylistPublishPayload(
    localizedPublishDto,
    images,
    videos,
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

const validatePlaylistMetadata = (
  publishDto: PlaylistPublishDto,
  videos: DetailedVideo[],
  config: Config,
): PublishValidationMessage[] => {
  const validations: PublishValidationMessage[] = [];
  const pushValidationError = (
    message: string,
    context: PublishValidationContextEnum,
  ): void => {
    validations.push(createValidationError(message, context));
  };
  const pushValidationWarning = (
    message: string,
    context: PublishValidationContextEnum,
  ): void => {
    validations.push(createValidationWarning(message, context));
  };

  // There is at least one program otherwise it returns an error.
  if (
    publishDto.programs === null ||
    publishDto.programs === undefined ||
    (publishDto.programs && publishDto.programs.length === 0)
  ) {
    pushValidationError(
      ValidationErrors.PlaylistMissingPrograms.message,
      'METADATA',
    );
  } else {
    // Determine the length of playlist in hours
    const diffInHours = getHoursDifference(
      publishDto.start_date_time,
      publishDto.calculated_end_date_time,
    );
    // Return a warning if the total playlist length exceeds 24 hours.
    if (diffInHours > 24 && diffInHours < 25) {
      pushValidationWarning(
        ValidationErrors.PlaylistExceeds24Hours.message,
        'METADATA',
      );
    }
    // Return an error if the total playlist length exceeds 25 hours.
    if (diffInHours >= 25) {
      pushValidationError(
        ValidationErrors.PlaylistExceeds25Hours.message,
        'METADATA',
      );
    }

    if (config.playlistShouldBe24Hours && diffInHours < 24) {
      pushValidationWarning(
        ValidationErrors.PlaylistProlongation.message,
        'METADATA',
      );
    }

    // Determine if the playlist start date is more than 24 hours in the past
    const playlistStartTimeComparedToNow = getHoursDifference(
      publishDto.start_date_time,
      new Date().toISOString(),
    );
    if (playlistStartTimeComparedToNow >= 24) {
      pushValidationError(
        ValidationErrors.PlaylistIsTooOld.message,
        'METADATA',
      );
    }

    // Playlist cannot start and end with an AD_POD (integration with AIP breaks on playlist loop)
    const firstSchedule = publishDto.programs
      ?.reduce((prev, curr) => {
        return prev.sort_index < curr.sort_index ? prev : curr;
      })
      ?.program_cue_points?.find((x) => x.type === 'PRE')
      ?.cue_point_schedules?.sort((prev, curr) => {
        return curr.sort_index - prev.sort_index;
      })?.[0];

    const lastSchedule = publishDto.programs
      ?.reduce((prev, curr) => {
        return prev.sort_index > curr.sort_index ? prev : curr;
      })
      ?.program_cue_points?.find((x) => x.type === 'POST')
      ?.cue_point_schedules?.sort((prev, curr) => {
        return curr.sort_index - prev.sort_index;
      })?.[0];

    if (firstSchedule?.type === 'AD_POD' && lastSchedule?.type === 'AD_POD') {
      pushValidationError(
        ValidationErrors.PlaylistCannotStartAndEndWithAdPod.message,
        'METADATA',
      );
    }

    // Check for all videos in playlist to have at least one mutual stream format.
    // Mutual video stream format(s) are required to create a consistent live stream.
    const mutualStreams = extractSharedVideoStreamFormats(videos);
    if (mutualStreams.length < 1) {
      pushValidationError(
        ValidationErrors.PlaceholderAndPlaylistVideosHaveNoMutualStreams
          .message,
        'VIDEOS',
      );
    }
  }
  return validations;
};

const getHoursDifference = (startDate: string, endDate: string): number => {
  return getPlaylistDurationInSeconds(startDate, endDate) / 60 / 60;
};

const getPlaylistDurationInSeconds = (
  playlistStartDate: string,
  playlistEndDate: string,
): number => {
  return (
    Math.floor(
      new Date(playlistEndDate).getTime() -
        new Date(playlistStartDate).getTime(),
    ) / 1000
  );
};

export interface StreamParams {
  width: number | undefined | null;
  height: number | undefined | null;
  bitrate_in_kbps: number | undefined | null;
  frame_rate: number | undefined | null;
}

/**
 *  Gets a list of video stream parameters that are shared across all videos.
 * @param videos - list of videos, where to find shared stream formats.
 * @returns - list of stream parameters, shared by all videos.
 */
export const extractSharedVideoStreamFormats = (
  videos: DetailedVideo[],
): StreamParams[] => {
  const videoStreams =
    videos.reduce((result, entry) => {
      const streams = entry.video_encoding.video_streams
        .filter((x) => x.type === 'VIDEO')
        .map((vs) => {
          return {
            width: vs.width,
            height: vs.height,
            bitrate_in_kbps: vs.bitrate_in_kbps,
            frame_rate: vs.frame_rate,
          };
        });
      return [...result, streams];
    }, new Array<StreamParams[]>()) ?? new Array<StreamParams[]>();

  if (videoStreams.length > 0) {
    return videoStreams.reduce((join, current) =>
      join.filter((el) =>
        current.find(
          (c) =>
            c.height === el.height &&
            c.width === el.width &&
            c.bitrate_in_kbps === el.bitrate_in_kbps &&
            c.frame_rate === el.frame_rate,
        ),
      ),
    );
  } else {
    return [];
  }
};
