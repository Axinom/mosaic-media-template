import { PublishServiceMessagingSettings } from 'media-messages';
import { publishingCollectionProcessor } from './collections/handlers';
import {
  publishingMovieGenresProcessor,
  publishingMovieProcessor,
} from './movies';
import { PermissionKey } from './permission-definition';
import { publishingReviewProcessor } from './reviews/handlers/publishing-review-processor';
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
  PublishServiceMessagingSettings.ReviewPublished,
  PublishServiceMessagingSettings.ReviewUnpublished,
];

export const publishingProcessors = [
  publishingMovieProcessor,
  publishingMovieGenresProcessor,
  publishingTvshowGenresProcessor,
  publishingTvshowProcessor,
  publishingSeasonProcessor,
  publishingEpisodeProcessor,
  publishingCollectionProcessor,
  publishingReviewProcessor,
];

export const publishHandlerPermissions: PermissionKey[] = [
  'ADMIN',
  'COLLECTIONS_EDIT',
  'MOVIES_EDIT',
  'SETTINGS_EDIT',
  'TVSHOWS_EDIT',
  'REVIEWS_EDIT',
];
