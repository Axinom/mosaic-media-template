import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { TransactionalMessageHandler } from 'pg-transactional-outbox';
import { Config } from '../../common';
import { RegisterContentTypeMessaging } from '../../messaging';
import {
  ChannelPublishedEventHandler,
  ChannelUnpublishedEventHandler,
  CheckChannelJobStatusFailedEventHandler,
  CheckChannelJobStatusSucceededEventHandler,
  LiveStreamProtectionKeyCreatedEventHandler,
  PlaylistPublishedEventHandler,
  PlaylistUnpublishedEventHandler,
} from './handlers';

export const registerChannelsMessaging: RegisterContentTypeMessaging =
  function (
    inboxWriter: RabbitMqInboxWriter,
    config: Config,
  ): RascalConfigBuilder[] {
    return [
      new RascalTransactionalConfigBuilder(
        ChannelServiceMessagingSettings.ChannelPublished,
        config,
      ).subscribeForEvent(() => inboxWriter),
      new RascalTransactionalConfigBuilder(
        ChannelServiceMessagingSettings.ChannelUnpublished,
        config,
      ).subscribeForEvent(() => inboxWriter),

      new RascalTransactionalConfigBuilder(
        ChannelServiceMessagingSettings.PlaylistPublished,
        config,
      ).subscribeForEvent(() => inboxWriter),
      new RascalTransactionalConfigBuilder(
        ChannelServiceMessagingSettings.PlaylistUnpublished,
        config,
      ).subscribeForEvent(() => inboxWriter),

      new RascalTransactionalConfigBuilder(
        VodToLiveServiceMessagingSettings.CheckChannelJobStatusSucceeded,
        config,
      ).subscribeForEvent(() => inboxWriter),
      new RascalTransactionalConfigBuilder(
        VodToLiveServiceMessagingSettings.CheckChannelJobStatusFailed,
        config,
      ).subscribeForEvent(() => inboxWriter),

      new RascalTransactionalConfigBuilder(
        VodToLiveServiceMessagingSettings.LiveStreamProtectionKeyCreated,
        config,
      ).subscribeForEvent(() => inboxWriter),
    ];
  };

export const registerChannelsHandlers = (
  config: Config,
): TransactionalMessageHandler[] => {
  return [
    new ChannelPublishedEventHandler(config),
    new ChannelUnpublishedEventHandler(config),
    new PlaylistPublishedEventHandler(config),
    new PlaylistUnpublishedEventHandler(config),
    new CheckChannelJobStatusSucceededEventHandler(config),
    new CheckChannelJobStatusFailedEventHandler(config),
    new LiveStreamProtectionKeyCreatedEventHandler(config),
  ];
};
