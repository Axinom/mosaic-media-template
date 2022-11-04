import { PublishServiceMessagingSettings } from 'media-messages';
import { publishingCollectionProcessor } from './collections/handlers';
import {
  publishingMovieGenresProcessor,
  publishingMovieProcessor,
} from './movies';
import { PermissionKey } from './permission-definition';
import {
  publishingEpisodeProcessor,
  publishingSeasonProcessor,
  publishingTvshowGenresProcessor,
  publishingTvshowProcessor,
} from './tvshows';

export const entityPublishEventSettings = [
  PublishServiceMessagingSettings.MoviePublished,
  PublishServiceMessagingSettings.MovieUnpublished,
  PublishServiceMessagingSettings.MovieGenresPublished,
  PublishServiceMessagingSettings.MovieGenresUnpublished,
  PublishServiceMessagingSettings.TvshowGenresPublished,
  PublishServiceMessagingSettings.TvshowGenresUnpublished,
  PublishServiceMessagingSettings.TvshowPublished,
  PublishServiceMessagingSettings.TvshowUnpublished,
  PublishServiceMessagingSettings.SeasonPublished,
  PublishServiceMessagingSettings.SeasonUnpublished,
  PublishServiceMessagingSettings.EpisodePublished,
  PublishServiceMessagingSettings.EpisodeUnpublished,
  PublishServiceMessagingSettings.CollectionPublished,
  PublishServiceMessagingSettings.CollectionUnpublished,
];

export const publishingProcessors = [
  publishingMovieProcessor,
  publishingMovieGenresProcessor,
  publishingTvshowGenresProcessor,
  publishingTvshowProcessor,
  publishingSeasonProcessor,
  publishingEpisodeProcessor,
  publishingCollectionProcessor,
];

export const publishHandlerPermissions: PermissionKey[] = [
  'ADMIN',
  'COLLECTIONS_EDIT',
  'MOVIES_EDIT',
  'SETTINGS_EDIT',
  'TVSHOWS_EDIT',
];
