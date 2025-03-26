import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { PublishServiceMessagingSettings } from 'media-messages';
import { TransactionalMessageHandler } from 'pg-transactional-outbox';
import { Config } from '../../common';
import { RegisterContentTypeMessaging } from '../../messaging';
import {
  ReviewPublishedEventHandler,
  ReviewUnpublishedEventHandler,
} from './handlers';

export const registerReviewsMessaging: RegisterContentTypeMessaging = function (
  inboxWriter: RabbitMqInboxWriter,
  config: Config,
) {
  return [
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.ReviewPublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
    new RascalTransactionalConfigBuilder(
      PublishServiceMessagingSettings.ReviewUnpublished,
      config,
    ).subscribeForEvent(() => inboxWriter),
  ];
};

export const registerReviewsHandlers = (
  config: Config,
): TransactionalMessageHandler[] => {
  return [
    new ReviewPublishedEventHandler(config),
    new ReviewUnpublishedEventHandler(config),
  ];
};
