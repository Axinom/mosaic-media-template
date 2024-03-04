import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { PublishServiceMessagingSettings } from 'media-messages';
import { TransactionalMessageHandler } from 'pg-transactional-outbox';
import { Config } from '../../common';
import { RegisterContentTypeMessaging } from '../../messaging';
import {
  EpisodePublishedEventHandler,
  EpisodeUnpublishedEventHandler,
  SeasonUnpublishedEventHandler,
  TvshowGenresPublishedEventHandler,
  TvshowGenresUnpublishedEventHandler,
  TvshowPublishedEventHandler,
  TvshowUnpublishedEventHandler,
} from './handlers';
import { SeasonPublishedEventHandler } from './handlers/season-published-event-handler';

export const registerTvshowsMessaging: RegisterContentTypeMessaging = function (
  inboxWriter: RabbitMqInboxWriter,
  config: Config,
) {
  return [
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.TvshowGenresPublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.TvshowGenresUnpublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.TvshowPublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.TvshowUnpublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.SeasonPublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.SeasonUnpublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.EpisodePublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.EpisodeUnpublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
  ];
};

export const registerTvshowsHandlers = (
  config: Config,
): TransactionalMessageHandler[] => {
  return [
    new TvshowGenresPublishedEventHandler(config),
    new TvshowGenresUnpublishedEventHandler(config),
    new TvshowPublishedEventHandler(config),
    new TvshowUnpublishedEventHandler(config),
    new SeasonPublishedEventHandler(config),
    new SeasonUnpublishedEventHandler(config),
    new EpisodePublishedEventHandler(config),
    new EpisodeUnpublishedEventHandler(config),
  ];
};
