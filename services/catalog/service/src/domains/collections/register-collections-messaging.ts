import { LoginPgPool } from '@axinom/mosaic-db-common';
import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { PublishServiceMessagingSettings } from 'media-messages';
import { Config } from '../../common';
import { ContentTypeRegistrant } from '../../messaging';
import {
  CollectionPublishedEventHandler,
  CollectionUnpublishedEventHandler,
} from './handlers';

export const registerCollectionsMessaging: ContentTypeRegistrant = function (
  config: Config,
  loginPool: LoginPgPool,
) {
  return [
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.CollectionPublished,
      config,
    ).subscribeForEvent(
      () => new CollectionPublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      PublishServiceMessagingSettings.CollectionUnpublished,
      config,
    ).subscribeForEvent(
      () => new CollectionUnpublishedEventHandler(loginPool, config),
    ),
  ];
};
