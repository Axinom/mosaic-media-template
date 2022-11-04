import {
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import axios from 'axios';
import { capitalize } from 'inflection';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { SnapshotValidationResult } from '../../../publishing';
import { GqlVideo, PublishVideo, TrailerJSONSelectable } from '../models';

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
  const videoStreams = gqlVideo.videoStreams.nodes.map((videoStream) => {
    return {
      drm_key_id: videoStream.keyId ?? undefined,
      iv: videoStream.iv ?? undefined,
      format: videoStream.format ?? undefined,
      initial_file: videoStream.initialFile ?? undefined,
      label: videoStream.label ?? undefined,
      language_code: videoStream.languageCode ?? undefined,
      bandwidth_in_bps: videoStream.bandwidthInBps ?? undefined,
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
    duration: gqlVideo.durationInSeconds ?? undefined,
    audio_languages: gqlVideo.audioLanguages ?? undefined,
    subtitle_languages: gqlVideo.subtitleLanguages ?? undefined,
    caption_languages: gqlVideo.captionLanguages ?? undefined,
    hls_manifest: gqlVideo.hlsManifestPath ?? undefined,
    dash_manifest: gqlVideo.dashManifestPath ?? undefined,
    video_streams: videoStreams.length > 0 ? videoStreams : undefined,
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
    const result = await axios.post(
      urljoin(encodingServiceBaseUrl, 'graphql'),
      {
        query: `
          query GetVideosMetadata($filter: VideoFilter) {
            videos(filter: $filter) {
              nodes {
                id
                title
                durationInSeconds
                audioLanguages
                captionLanguages
                subtitleLanguages
                dashManifestPath
                hlsManifestPath
                isProtected
                outputFormat
                previewStatus
                encodingState
                videosTags {
                  nodes {
                    name
                  }
                }
                videoStreams {
                  nodes {
                    keyId
                    label
                    format
                    initialFile
                    iv                    
                    languageCode
                    bandwidthInBps
                  }
                }
              }
            }
          }
        `,
        variables: {
          filter: { id: { in: videoIds } },
        },
      },
      { headers: { Authorization: `Bearer ${authToken}` } },
    );

    if (result.data.errors?.length > 0) {
      throw new MosaicError({
        ...CommonErrors.PublishVideosMetadataRequestError,
        details: {
          errors: result.data.errors,
        },
      });
    }

    const validation: SnapshotValidationResult[] = [];
    const publishData: PublishVideo[] = [];

    if (mainVideoId) {
      processVideo(
        mainVideoId,
        result.data.data.videos.nodes,
        'MAIN',
        'TRAILER',
        validation,
        publishData,
      );
    }

    for (const trailerAssignment of trailers) {
      processVideo(
        trailerAssignment.video_id,
        result.data.data.videos.nodes,
        'TRAILER',
        'MAIN',
        validation,
        publishData,
      );
    }

    return { result: publishData, validation };
  } catch (error) {
    const mapper = mosaicErrorMappingFactory(
      (error: Error & { response?: { data?: { errors?: unknown[] } } }) => {
        return {
          ...CommonErrors.PublishVideosMetadataRequestError,
          details: {
            errors: error.response?.data?.errors,
          },
        };
      },
    );
    throw mapper(error);
  }
};
