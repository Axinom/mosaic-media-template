import { LoginPgPool } from '@axinom/mosaic-db-common';
import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { PublishServiceMessagingSettings } from 'media-messages';
import { Config } from '../../common';
import { ContentTypeRegistrant } from '../../messaging';
import {
  MovieGenresPublishedEventHandler,
  MovieGenresUnpublishedEventHandler,
  MoviePublishedEventHandler,
  MovieUnpublishedEventHandler,
} from './handlers';

export const registerMoviesMessaging: ContentTypeRegistrant = function (
  config: Config,
  loginPool: LoginPgPool,
) {
  return [
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.MoviePublished,
      config,
    ).subscribeForEvent(
      () => new MoviePublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.MovieUnpublished,
      config,
    ).subscribeForEvent(
      () => new MovieUnpublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.MovieGenresPublished,
      config,
    ).subscribeForEvent(
      () => new MovieGenresPublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.MovieGenresUnpublished,
      config,
    ).subscribeForEvent(
      () => new MovieGenresUnpublishedEventHandler(loginPool, config),
    ),
  ];
};
