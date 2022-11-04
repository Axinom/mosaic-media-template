import {
  isNullOrWhitespace,
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import { GraphQLClient } from 'graphql-request';
import { ClientError, GraphQLError } from 'graphql-request/dist/types';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import {
  GetEpisodeMainVideoQuery,
  GetMovieMainVideoQuery,
  getSdk,
} from '../../../generated/graphql/catalog';

export type EntityWithVideoType = 'movie' | 'episode';

type MovieVideo = NonNullable<
  GetMovieMainVideoQuery['movie']
>['videos']['nodes'][0];
type EpisodeVideo = NonNullable<
  GetEpisodeMainVideoQuery['episode']
>['videos']['nodes'][0];

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

const getCatalogResponseVideo = (
  type: EntityWithVideoType,
  id: string,
  videos: MovieVideo[] | EpisodeVideo[] | undefined,
): MovieVideo | EpisodeVideo => {
  const identifier = `${type} with ID '${id}'`;

  if (!videos) {
    throw new MosaicError({
      ...CommonErrors.EntityNotFound,
      messageParams: [identifier, type],
    });
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

  if (
    !videos[0].isProtected ||
    !videos[0].videoStreams ||
    videos[0].videoStreams.nodes.length === 0 || // A protected video will always have a video_streams record
    videos[0].videoStreams.nodes
      .map((videoStream) => videoStream.drmKeyId)
      .filter((drmKeyId) => !isNullOrWhitespace(drmKeyId)).length === 0
  ) {
    throw new MosaicError({
      ...CommonErrors.VideoNotProtected,
      messageParams: [identifier],
    });
  }

  return videos[0];
};

export const getEntityType = (id: string): EntityWithVideoType => {
  if (isNullOrWhitespace(id)) {
    throw new MosaicError(CommonErrors.EmptyEntityId);
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

export const getVideo = async (
  type: EntityWithVideoType,
  id: string,
  catalogUrl: string,
  countryCode?: string,
): Promise<MovieVideo | EpisodeVideo> => {
  try {
    const client = new GraphQLClient(urljoin(catalogUrl, 'graphql'));
    const { GetMovieMainVideo, GetEpisodeMainVideo } = getSdk(client);
    if (type === 'movie') {
      const result = await GetMovieMainVideo({ id, countryCode });
      return getCatalogResponseVideo(
        type,
        id,
        result.data?.movie?.videos.nodes,
      );
    } else {
      const result = await GetEpisodeMainVideo({ id, countryCode });
      return getCatalogResponseVideo(
        type,
        id,
        result.data?.episode?.videos.nodes,
      );
    }
  } catch (error) {
    throw getCatalogMappedError(error, { id, type });
  }
};
