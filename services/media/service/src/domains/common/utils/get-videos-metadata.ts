import {
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import { capitalize } from 'inflection';
import { VideoStream } from 'media-messages';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { getSdk, GetVideosQuery } from '../../../generated/graphql/encoding';
import { SnapshotValidationResult } from '../../../publishing';
import { PublishVideo, TrailerJSONSelectable } from '../models';

export type GqlVideo = NonNullable<GetVideosQuery['videos']>['nodes'][0];

interface VideoApiResults {
  validation: SnapshotValidationResult[];
  result: PublishVideo[];
}

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
  const videoStreams: VideoStream[] = gqlVideo.videoStreams.nodes.map((s) => {
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

  result.push({
    type: assignmentType,
    title: gqlVideo.title,
    is_protected: gqlVideo.isProtected,
    output_format: gqlVideo.outputFormat,
    length_in_seconds: gqlVideo.lengthInSeconds,
    hls_manifest: gqlVideo.hlsManifestPath,
    dash_manifest: gqlVideo.dashManifestPath,
    audio_languages: gqlVideo.audioLanguages.filter(Boolean) as string[],
    subtitle_languages: gqlVideo.subtitleLanguages.filter(Boolean) as string[],
    caption_languages: gqlVideo.captionLanguages.filter(Boolean) as string[],
    video_streams: videoStreams,
  });
};

export const getVideosMetadata = async (
  encodingServiceBaseUrl: string,
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
    const client = new GraphQLClient(
      urljoin(encodingServiceBaseUrl, 'graphql'),
    );
    const { GetVideos } = getSdk(client);
    const { data } = await GetVideos(
      { filter: { id: { in: videoIds } } },
      { Authorization: `Bearer ${authToken}` },
    );

    if (!data.videos?.nodes) {
      throw new MosaicError({
        ...CommonErrors.PublishVideosMetadataRequestError,
        logInfo: {
          reason:
            'Request to the encoding service succeeded, but no videos were returned and explicit error was not throw.',
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
    const mapper = mosaicErrorMappingFactory(
      (error: Error & { response?: { errors?: unknown[] } }) => {
        return {
          ...CommonErrors.PublishVideosMetadataRequestError,
          details: {
            errors: error.response?.errors,
          },
        };
      },
    );
    // Throwing an actual error instead of returning a validation error because
    // this usually gets called in context of a message handler and there is a
    // chance to recover using the message retry strategy.
    throw mapper(error);
  }
};
