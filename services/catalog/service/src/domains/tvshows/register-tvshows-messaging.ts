import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
  StoreOutboxMessage,
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
  storeOutboxMessage: StoreOutboxMessage,
  config: Config,
): TransactionalMessageHandler[] => {
  return [
    new TvshowGenresPublishedEventHandler(config),
    new TvshowGenresUnpublishedEventHandler(config),
    new TvshowPublishedEventHandler(storeOutboxMessage, config),
    new TvshowUnpublishedEventHandler(storeOutboxMessage, config),
    new SeasonPublishedEventHandler(storeOutboxMessage, config),
    new SeasonUnpublishedEventHandler(storeOutboxMessage, config),
    new EpisodePublishedEventHandler(storeOutboxMessage, config),
    new EpisodeUnpublishedEventHandler(storeOutboxMessage, config),
  ];
};
