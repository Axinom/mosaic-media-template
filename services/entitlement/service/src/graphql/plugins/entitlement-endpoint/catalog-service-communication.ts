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
        logInfo: { errors: error.response.errors },
      };
    }
    return {
      ...CommonErrors.CatalogErrors,
      logInfo: { errors: error.response.errors },
      messageParams: [context?.type, context?.id],
    };
  }

  if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
    return CommonErrors.CatalogConnectionFailed;
  }

  return undefined;
});

const getValidatedKeyIds = (
  type: EntityWithVideoType,
  id: string,
  videos: MovieVideo[] | EpisodeVideo[] | ChannelVideo | null | undefined,
): string[] => {
  const identifier = `${type} with ID '${id}'`;

  if (!videos) {
    throw new MosaicError({
      ...CommonErrors.EntityNotFound,
      messageParams: [identifier, type],
    });
  }

  if (!Array.isArray(videos)) {
    if (isNullOrWhitespace(videos.keyId)) {
      throw new MosaicError({
        ...CommonErrors.VideoNotProtected,
        messageParams: [identifier],
      });
    }
    if (
      isNullOrWhitespace(videos.dashStreamUrl) ||
      isNullOrWhitespace(videos.hlsStreamUrl)
    ) {
      throw new MosaicError({
        ...CommonErrors.ChannelStreamUnavailable,
        messageParams: [identifier],
      });
    }
    return [videos.keyId];
  }

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

  // A protected video will always have at least one stream with non-empty Key ID
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

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
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
    const client = new GraphQLClient(urljoin(catalogUrl, 'graphql'));
    const { GetMovieMainVideo, GetEpisodeMainVideo, GetChannelVideo } =
      getSdk(client);
    switch (type) {
      case 'movie': {
        const result = await GetMovieMainVideo({ id, countryCode });
        return getValidatedKeyIds(type, id, result.data?.movie?.videos.nodes);
      }
      case 'episode': {
        const result = await GetEpisodeMainVideo({ id, countryCode });
        return getValidatedKeyIds(type, id, result.data?.episode?.videos.nodes);
      }
      case 'channel': {
        const result = await GetChannelVideo({ id });
        return getValidatedKeyIds(type, id, result.data.channel);
      }
      default:
        throw new UnreachableCaseError(type);
    }
  } catch (error) {
    throw getCatalogMappedError(error, { id, type });
  }
};
