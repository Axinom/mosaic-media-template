import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { PublishServiceMessagingSettings } from 'media-messages';
import { TransactionalMessageHandler } from 'pg-transactional-outbox';
import { Config } from '../../common';
import { RegisterContentTypeMessaging } from '../../messaging';
import {
  CollectionPublishedEventHandler,
  CollectionUnpublishedEventHandler,
} from './handlers';

export const registerCollectionsMessaging: RegisterContentTypeMessaging =
  function (inboxWriter: RabbitMqInboxWriter, config: Config) {
    return [
      new RascalTransactionalConfigBuilder(
        PublishServiceMessagingSettings.CollectionPublished,
        config,
      ).subscribeForEvent(() => inboxWriter),
      new RascalTransactionalConfigBuilder(
        PublishServiceMessagingSettings.CollectionUnpublished,
        config,
      ).subscribeForEvent(() => inboxWriter),
    ];
  };

export const registerCollectionsHandlers = (
  config: Config,
): TransactionalMessageHandler[] => {
  return [
    new CollectionPublishedEventHandler(config),
    new CollectionUnpublishedEventHandler(config),
  ];
};
