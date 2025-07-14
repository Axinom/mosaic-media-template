import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
  StoreOutboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { CatalogServiceMessagingSettings, PublishServiceMessagingSettings } from 'media-messages';
import { TransactionalMessageHandler } from 'pg-transactional-outbox';
import { Config } from '../../common';
import { RegisterContentTypeMessaging } from '../../messaging';
import {
  MovieGenresPublishedEventHandler,
  MovieGenresUnpublishedEventHandler,
  MoviePublishedEventHandler,
  MovieUnpublishedEventHandler,
} from './handlers';

export const registerMoviesMessaging: RegisterContentTypeMessaging = function (
  inboxWriter: RabbitMqInboxWriter,
  config: Config,
) {
  return [
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.MoviePublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.MovieUnpublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.MovieGenresPublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.MovieGenresUnpublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      CatalogServiceMessagingSettings.EntityPublishSuccess,
      config,
    ).publishEvent(),
  ];
};

export const registerMoviesHandlers = (
  storeOutboxMessage: StoreOutboxMessage,
  config: Config,
): TransactionalMessageHandler[] => {
  return [
    new MoviePublishedEventHandler(storeOutboxMessage, config),
    new MovieUnpublishedEventHandler(storeOutboxMessage, config),
    new MovieGenresPublishedEventHandler(config),
    new MovieGenresUnpublishedEventHandler(config),
  ];
};
