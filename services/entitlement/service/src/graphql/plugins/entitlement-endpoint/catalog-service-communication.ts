import {
  isNullOrWhitespace,
  MosaicError,
  mosaicErrorMappingFactory,
  UnreachableCaseError,
} from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import { ClientError, GraphQLError } from 'graphql-request/dist/types';
import urljoin from 'url-join';
import { CommonErrors, sanitizeStringArray } from '../../../common';
import {
  GetChannelVideoQuery,
  GetEpisodeMainVideoQuery,
  GetMovieMainVideoQuery,
  getSdk,
} from '../../../generated/graphql/catalog';

export type EntityWithVideoType = 'movie' | 'episode' | 'channel';

type MovieVideo = NonNullable<
  GetMovieMainVideoQuery['movie']
>['videos']['nodes'][0];
type EpisodeVideo = NonNullable<
  GetEpisodeMainVideoQuery['episode']
>['videos']['nodes'][0];
type ChannelVideo = NonNullable<GetChannelVideoQuery['channel']>;

const getCatalogMappedError = mosaicErrorMappingFactory<{
  type: EntityWithVideoType;
  id: string;
}>((error: Partial<ClientError> & { code?: string }, context) => {
  if (
    error instanceof ClientError &&
    error.response.errors &&
    error.response.errors.length > 0
  ) {
    const gqlError = error.response.errors[0] as GraphQLError & {
      code?: string;
    };
    if (
      gqlError.code === CommonErrors.LicenseIsNotValid.code ||
      gqlError.code === CommonErrors.LicenseNotFound.code
    ) {
      return {
        message: gqlError.message,
        code: gqlError.code,
        details: { errors: error.response.errors },
      };
    }
    return {
      ...CommonErrors.CatalogErrors,
      details: { errors: error.response.errors },
      messageParams: [context?.type, context?.id],
    };
  }

  if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
    return {
      ...CommonErrors.CatalogConnectionFailed,
      details: { code: error.code, message: error.message },
    };
  }

  return undefined;
});

const assertEntityIsFound: <T>(
  value: T | undefined | null,
  type: EntityWithVideoType,
  identifier: string,
) => asserts value = <TType>(
  value: TType | undefined | null,
  type: EntityWithVideoType,
  identifier: string,
): asserts value is TType => {
  if (!value) {
    throw new MosaicError({
      ...CommonErrors.EntityNotFound,
      messageParams: [identifier, type],
    });
  }
};

const getValidatedChannelKeyId = (
  video: ChannelVideo,
  identifier: string,
): string[] => {
  if (isNullOrWhitespace(video.keyId)) {
    throw new MosaicError({
      ...CommonErrors.VideoNotProtected,
      messageParams: [identifier],
    });
  }

  if (
    isNullOrWhitespace(video.dashStreamUrl) ||
    isNullOrWhitespace(video.hlsStreamUrl)
  ) {
    throw new MosaicError({
      ...CommonErrors.ChannelStreamUnavailable,
      messageParams: [identifier],
    });
  }

  return [video.keyId];
};

const getValidatedMediaKeyIds = (
  videos: MovieVideo[] | EpisodeVideo[],
  identifier: string,
): string[] => {
  if (videos.length === 0) {
    throw new MosaicError({
      ...CommonErrors.NoMainVideo,
      messageParams: [identifier],
    });
  }

  if (videos.length > 1) {
    throw new MosaicError({
      ...CommonErrors.MultipleMainVideos,
      messageParams: [identifier],
    });
  }

  const [video] = videos;
  const keyIds = sanitizeStringArray(
    video?.videoStreams?.nodes?.map((videoStream) => videoStream.keyId),
  );

  // A protected video must always have at least one stream with non-empty Key ID
  if (!video.isProtected || keyIds.length === 0) {
    throw new MosaicError({
      ...CommonErrors.VideoNotProtected,
      messageParams: [identifier],
    });
  }

  return keyIds;
};

export const getEntityType = (id: string): EntityWithVideoType => {
  if (isNullOrWhitespace(id)) {
    throw new MosaicError(CommonErrors.EmptyEntityId);
  }

  const channelUuidRegex =
    /^channel-[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (channelUuidRegex.test(id)) {
    return 'channel';
  }

  if (!id.match(/^(movie-|episode-)\d{1,10}$/)) {
    throw new MosaicError({
      ...CommonErrors.InvalidEntityId,
      messageParams: [id],
    });
  }

  if (id.startsWith('movie-')) {
    return 'movie';
  } else {
    return 'episode';
  }
};

export const getVideoKeyIds = async (
  type: EntityWithVideoType,
  id: string,
  catalogUrl: string,
  countryCode?: string,
): Promise<string[]> => {
  try {
    const identifier = `${type} with ID '${id}'`;
    const client = new GraphQLClient(urljoin(catalogUrl, 'graphql'));
    const { GetMovieMainVideo, GetEpisodeMainVideo, GetChannelVideo } =
      getSdk(client);
    switch (type) {
      case 'movie': {
        const result = await GetMovieMainVideo({ id, countryCode });
        const videos = result.data?.movie?.videos.nodes;
        assertEntityIsFound(videos, type, identifier);
        return getValidatedMediaKeyIds(videos, identifier);
      }
      case 'episode': {
        const result = await GetEpisodeMainVideo({ id, countryCode });
        const videos = result.data?.episode?.videos.nodes;
        assertEntityIsFound(videos, type, identifier);
        return getValidatedMediaKeyIds(videos, identifier);
      }
      case 'channel': {
        const result = await GetChannelVideo({ id });
        const video = result.data.channel;
        assertEntityIsFound(video, type, identifier);
        return getValidatedChannelKeyId(video, identifier);
      }
      default:
        throw new UnreachableCaseError(type);
    }
  } catch (error) {
    console.log('*****getVideoKeyIds ERROR*****');
    console.log(error);
    throw getCatalogMappedError(error, { id, type });
  }
};
