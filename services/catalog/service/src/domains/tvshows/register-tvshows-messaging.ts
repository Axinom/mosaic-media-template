import { LoginPgPool } from '@axinom/mosaic-db-common';
import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { PublishServiceMessagingSettings } from 'media-messages';
import { Config } from '../../common';
import { ContentTypeRegistrant } from '../../messaging';
import {
  EpisodePublishedEventHandler,
  EpisodeUnpublishedEventHandler,
  SeasonPublishedEventHandler,
  SeasonUnpublishedEventHandler,
  TvshowGenresPublishedEventHandler,
  TvshowGenresUnpublishedEventHandler,
  TvshowPublishedEventHandler,
  TvshowUnpublishedEventHandler,
} from './handlers';

export const registerTvshowsMessaging: ContentTypeRegistrant = function (
  config: Config,
  loginPool: LoginPgPool,
) {
  return [
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.TvshowGenresPublished,
      config,
    ).subscribeForEvent(
      () => new TvshowGenresPublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.TvshowGenresUnpublished,
      config,
    ).subscribeForEvent(
      () => new TvshowGenresUnpublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.TvshowPublished,
      config,
    ).subscribeForEvent(
      () => new TvshowPublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.TvshowUnpublished,
      config,
    ).subscribeForEvent(
      () => new TvshowUnpublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.SeasonPublished,
      config,
    ).subscribeForEvent(
      () => new SeasonPublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.SeasonUnpublished,
      config,
    ).subscribeForEvent(
      () => new SeasonUnpublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.EpisodePublished,
      config,
    ).subscribeForEvent(
      () => new EpisodePublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.EpisodeUnpublished,
      config,
    ).subscribeForEvent(
      () => new EpisodeUnpublishedEventHandler(loginPool, config),
    ),
  ];
};
