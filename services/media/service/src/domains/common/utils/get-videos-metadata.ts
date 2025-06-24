import {
  isNullOrWhitespace,
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import { capitalize } from 'inflection';
import { CuePoint, VideoStream } from 'media-messages';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { videoCuePointTypes } from '../../../domains/register-video-cue-point-types';
import { getSdk, GetVideosQuery } from '../../../generated/graphql/video';
import { SnapshotValidationResult } from '../../../publishing';
import { PublishVideo, TrailerJSONSelectable } from '../models';

export type GqlVideo = NonNullable<GetVideosQuery['videos']>['nodes'][0];

interface VideoApiResults {
  validation: SnapshotValidationResult[];
  result: PublishVideo[];
}

const getMappedError = mosaicErrorMappingFactory(
  (error: Error & { code?: string; response?: { errors?: unknown[] } }) => {
    if (error?.code === 'ECONNREFUSED') {
      return {
        ...CommonErrors.ServiceNotAccessible,
        messageParams: ['Video'],
      };
    }

    if (error.response?.errors) {
      return {
        ...CommonErrors.PublishVideosMetadataRequestError,
        details: {
          errors: error.response?.errors,
        },
      };
    }

    return CommonErrors.PublishVideosMetadataRequestError;
  },
);

const processVideo = (
  videoId: string,
  gqlVideos: GqlVideo[],
  assignmentType: Exclude<PublishVideo['type'], undefined>,
  alternativeType: Exclude<PublishVideo['type'], undefined>,
  validation: SnapshotValidationResult[],
  result: PublishVideo[],
): void => {
  const typeText = capitalize(assignmentType);
  const gqlVideo = gqlVideos.find((i) => i.id === videoId);
  if (!gqlVideo) {
    validation.push({
      context: 'VIDEO',
      message: `${typeText} video with id '${videoId}' no longer exists.`,
      severity: 'WARNING',
    });
    return;
  }

  const tags = gqlVideo.videosTags.nodes.map((tag) => tag.name);
  let drmKeyId: string | undefined;
  const videoStreams: VideoStream[] = gqlVideo.videoStreams.nodes.map((s) => {
    if (s.keyId !== undefined && s.keyId !== null && drmKeyId === undefined) {
      drmKeyId = s.keyId;
    }
    return {
      key_id: s.keyId,
      iv: s.iv,
      format: s.format,
      file: s.file,
      label: s.label,
      language_code: s.languageCode,
      bitrate_in_kbps: s.bitrateInKbps,
      type: s.type,
      file_template: s.fileTemplate,
      codecs: s.codecs,
      frame_rate: s.frameRate,
      height: s.height,
      width: s.width,
      display_aspect_ratio: s.displayAspectRatio,
      pixel_aspect_ratio: s.pixelAspectRatio,
      sampling_rate: s.samplingRate,
      language_name: s.languageName,
    };
  });
  const cuePoints: CuePoint[] = gqlVideo.cuePoints.nodes.map((cp) => {
    return {
      cue_point_type_key: cp.cuePointTypeKey,
      time_in_seconds: cp.timeInSeconds,
      value: cp.value,
    };
  });

  for (const cuePoint of cuePoints) {
    if (
      (gqlVideo.lengthInSeconds &&
        cuePoint.time_in_seconds > gqlVideo.lengthInSeconds) ||
      isNullOrWhitespace(gqlVideo.lengthInSeconds)
    ) {
      validation.push({
        context: 'VIDEO',
        message: `${typeText} video has a cue point ${cuePoint.cue_point_type_key} (${cuePoint.value}) defined at ${cuePoint.time_in_seconds} seconds that is longer than the video itself.`,
        severity: 'ERROR',
      });
    }
  }

  if (
    tags.length > 0 &&
    tags.findIndex(
      (tag) => tag.toLowerCase() === alternativeType.toLowerCase(),
    ) > -1
  ) {
    validation.push({
      context: 'VIDEO',
      message: `Possible video type mismatch! Video with type tag '${alternativeType}' is assigned as ${typeText} video.`,
      severity: 'WARNING',
    });
  }

  if (gqlVideo.encodingState !== 'READY') {
    validation.push({
      context: 'VIDEO',
      message: `${typeText} video has not finished encoding.`,
      severity: 'ERROR',
    });
  }

  if (assignmentType === 'MAIN' && gqlVideo.previewStatus !== 'APPROVED') {
    validation.push({
      context: 'VIDEO',
      message: `${typeText} video was not approved by Quality Assurance.`,
      severity: 'ERROR',
    });
  }

  if (assignmentType === 'TRAILER' && gqlVideo.previewStatus !== 'APPROVED') {
    validation.push({
      context: 'VIDEO',
      message: `${typeText} video was not approved by Quality Assurance.`,
      severity: 'WARNING',
    });
  }

  // For BeyondDutch, we're dropping the host and only taking the path, without the leading slash.
  // What we get from Video Service: https://outputstorage.blob.core.windows.net/media/1-1-heartland-s01-e01/video/hls/manifest.m3u8
  // What we publish: media/1-1-heartland-s01-e01/video/hls/manifest.m3u8
  let hlsManifestPath: string | null = null;
  let dashManifestPath: string | null = null;
  try {
    hlsManifestPath = !isNullOrWhitespace(gqlVideo.hlsManifestPath)
      ? new URL(gqlVideo.hlsManifestPath).pathname.substring(1)
      : null;
  } catch (error) {
    validation.push({
      context: 'VIDEO',
      message: `Invalid hlsManifestPath. Expecting a valid URL. Got ${gqlVideo.hlsManifestPath}.`,
      severity: 'ERROR',
    });
  }

  try {
    dashManifestPath = !isNullOrWhitespace(gqlVideo.dashManifestPath)
      ? new URL(gqlVideo.dashManifestPath).pathname.substring(1)
      : null;
  } catch (error) {
    validation.push({
      context: 'VIDEO',
      message: `Invalid dashManifestPath. Expecting a valid URL. Got ${gqlVideo.hlsManifestPath}.`,
      severity: 'ERROR',
    });
  }

  result.push({
    type: assignmentType,
    title: gqlVideo.title,
    is_protected: gqlVideo.isProtected,
    output_format: gqlVideo.outputFormat,
    length_in_seconds: gqlVideo.lengthInSeconds,
    drm_key_id: drmKeyId,
    hls_manifest: hlsManifestPath,
    dash_manifest: dashManifestPath,
    main_url: dashManifestPath ?? undefined,
    audio_languages: gqlVideo.audioLanguages.filter(Boolean) as string[],
    subtitle_languages: gqlVideo.subtitleLanguages.filter(Boolean) as string[],
    caption_languages: gqlVideo.captionLanguages.filter(Boolean) as string[],
    video_streams: videoStreams,
    cue_points: cuePoints,
  });
};

export const getVideosMetadata = async (
  videoServiceBaseUrl: string,
  authToken: string,
  mainVideoId: string | null,
  trailers: TrailerJSONSelectable[],
): Promise<VideoApiResults> => {
  const videoIds = trailers.map((t) => t.video_id);
  if (mainVideoId) {
    videoIds.push(mainVideoId);
  }

  if (videoIds.length === 0) {
    return { result: [], validation: [] };
  }

  try {
    const client = new GraphQLClient(urljoin(videoServiceBaseUrl, 'graphql'));
    const { GetVideos } = getSdk(client);
    const { data } = await GetVideos(
      {
        filter: { id: { in: videoIds } },
        cuePointFilter: {
          cuePointTypeKey: { in: videoCuePointTypes.map((t) => t.key) },
        },
      },
      { Authorization: `Bearer ${authToken}` },
    );

    if (!data.videos?.nodes) {
      throw new MosaicError({
        ...CommonErrors.PublishVideosMetadataRequestError,
        logInfo: {
          reason:
            'The request to the Video Service succeeded, but no videos were returned and an explicit error was not thrown.',
        },
      });
    }

    const validation: SnapshotValidationResult[] = [];
    const publishData: PublishVideo[] = [];

    if (mainVideoId) {
      processVideo(
        mainVideoId,
        data.videos.nodes,
        'MAIN',
        'TRAILER',
        validation,
        publishData,
      );
    }

    for (const trailerAssignment of trailers) {
      processVideo(
        trailerAssignment.video_id,
        data.videos.nodes,
        'TRAILER',
        'MAIN',
        validation,
        publishData,
      );
    }

    return { result: publishData, validation };
  } catch (error) {
    // Throwing an actual error instead of returning a validation error because
    // this usually gets called in context of a message handler and there is a
    // chance to recover using the message retry strategy.
    throw getMappedError(error);
  }
};
