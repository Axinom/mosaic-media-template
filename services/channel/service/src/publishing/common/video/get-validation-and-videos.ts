import { mosaicErrorMappingFactory } from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import { DetailedVideo } from 'media-messages';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { getSdk, GetVideosQuery } from '../../../generated/graphql/video';
import {
  createValidationError,
  createValidationWarning,
  PublishValidationMessage,
} from '../../models';

export type GqlVideo = NonNullable<GetVideosQuery['videos']>['nodes'][0];

export const getValidationAndVideos = async (
  videoServiceBaseUrl: string,
  authToken: string,
  videoIds: string[],
  isDrmEnabled: boolean,
  exactlyOneVideo: boolean,
): Promise<{
  videos: DetailedVideo[];
  validations: PublishValidationMessage[];
}> => {
  if (videoIds.length === 0) {
    return {
      videos: [],
      validations: [
        exactlyOneVideo
          ? createValidationError(`No video assigned.`, 'VIDEOS')
          : createValidationWarning(`No videos assigned.`, 'VIDEOS'),
      ],
    };
  }
  try {
    const validations: PublishValidationMessage[] = [];
    const client = new GraphQLClient(urljoin(videoServiceBaseUrl, 'graphql'));
    const { GetVideos } = getSdk(client);
    const { data } = await GetVideos(
      {
        filter: { id: { in: videoIds } },
      },
      { Authorization: `Bearer ${authToken}` },
    );
    const videosDetails = [];
    for (const videoAssignment of videoIds) {
      const gqlVideo = data?.videos?.nodes.find(
        (i) => i.id === videoAssignment,
      );
      if (!gqlVideo) {
        validations.push(
          createValidationError(
            `Details for the video with ID '${videoAssignment}' were not found.`,
            'VIDEOS',
          ),
        );
        continue;
      }

      if (gqlVideo.isProtected) {
        if (isDrmEnabled) {
          if (
            gqlVideo.videoStreams.nodes
              .filter(
                (s) => s.type !== 'SUBTITLE' && s.type !== 'CLOSED_CAPTION',
              )
              .find((s) => !s.keyId)
          ) {
            validations.push(
              createValidationError(
                `Video "${gqlVideo.title}" with ID ${gqlVideo.id} is protected but no key ids were found.`,
                'VIDEOS',
              ),
            );
          }
        } else {
          validations.push(
            createValidationError(
              `Video "${gqlVideo.title}" with ID ${gqlVideo.id} is DRM protected.`,
              'VIDEOS',
            ),
          );
        }
      }

      if (gqlVideo.outputFormat !== 'CMAF') {
        validations.push(
          createValidationError(
            `The output format of the video "${gqlVideo.title}" with ID ${gqlVideo.id} is '${gqlVideo.outputFormat}'. Expected output format 'CMAF'`,
            'VIDEOS',
          ),
        );
      }

      if (!gqlVideo.videoStreams.nodes.find((s) => s.type === 'AUDIO')) {
        createValidationError(
          `Video "${gqlVideo.title}" with ID ${gqlVideo.id} is missing an AUDIO stream.`,
          'VIDEOS',
        );
      }

      if (
        gqlVideo.videoStreams.nodes.find(
          (s) => s.type === 'VIDEO' && s.codecs !== 'H264',
        )
      ) {
        createValidationError(
          `Video "${gqlVideo.title}" with ID ${gqlVideo.id} is not encoded as 'H264'.`,
          'VIDEOS',
        );
      }

      videosDetails.push(toDetailedVideo(gqlVideo));
    }

    return {
      videos: videosDetails,
      validations,
    };
  } catch (e) {
    throw getCustomMappedError(e);
  }
};

const getCustomMappedError = mosaicErrorMappingFactory(
  (
    error: Error & {
      code?: string;
      response?: { errors?: unknown[] };
    },
  ) => {
    if (error?.code === 'ECONNREFUSED') {
      return {
        ...CommonErrors.ServiceNotAccessible,
        messageParams: ['Video'],
      };
    }

    if (error.response?.errors) {
      return {
        ...CommonErrors.UnableRetrieveVideoDetails,
        details: {
          errors: error.response?.errors,
        },
      };
    }

    return {
      ...CommonErrors.VideoDetailsRequestFailed,
      details: {
        error: error.message,
      },
    };
  },
);

export const toDetailedVideo = (video: GqlVideo): DetailedVideo => {
  return {
    id: video.id,
    title: video.title,
    custom_id: video.customId ?? null,
    source_file_name: video.sourceFileName,
    source_file_extension: video.sourceFileExtension,
    source_full_file_name: video.sourceFullFileName,
    source_location: video.sourceLocation,
    source_size_in_bytes: video.sourceSizeInBytes,
    is_archived: video.isArchived,
    videos_tags: video.videosTags.nodes.map((tag) => tag.name),
    video_encoding: {
      title: video.title,
      is_protected: video.isProtected,
      encoding_state: video.encodingState,
      output_format: video.outputFormat,
      output_location: video.outputLocation,
      dash_size_in_bytes: video.dashSizeInBytes,
      hls_size_in_bytes: video.hlsSizeInBytes,
      cmaf_size_in_bytes: video.cmafSizeInBytes,
      dash_manifest_path: video.dashManifestPath,
      hls_manifest_path: video.hlsManifestPath,
      audio_languages: video.audioLanguages,
      caption_languages: video.captionLanguages,
      subtitle_languages: video.subtitleLanguages,
      length_in_seconds: video.lengthInSeconds,
      finished_date: video.finishedDate,
      preview_status: video.previewStatus,
      preview_comment: video.previewComment,
      video_streams: video.videoStreams.nodes.map((s) => {
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
      }),
    },
  };
};
