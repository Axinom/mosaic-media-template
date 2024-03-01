import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { PublishServiceMessagingSettings } from 'media-messages';
import { TransactionalMessageHandler } from 'pg-transactional-outbox';
import { Config } from '../../common';
import { ContentTypeRegistrant } from '../../messaging';
import {
  MovieGenresPublishedEventHandler,
  MovieGenresUnpublishedEventHandler,
  MoviePublishedEventHandler,
  MovieUnpublishedEventHandler,
} from './handlers';

export const registerMoviesMessaging: ContentTypeRegistrant = function (
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
  ];
};

export const registerMoviesHandlers = (
  config: Config,
): TransactionalMessageHandler[] => {
  return [
    new MoviePublishedEventHandler(config),
    new MovieUnpublishedEventHandler(config),
    new MovieGenresPublishedEventHandler(config),
    new MovieGenresUnpublishedEventHandler(config),
  ];
};
