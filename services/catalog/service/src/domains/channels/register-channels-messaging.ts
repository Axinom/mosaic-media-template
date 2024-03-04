import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { ChannelServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import {
  RabbitMqInboxWriter,
  RascalTransactionalConfigBuilder,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { VodToLiveServiceMessagingSettings } from 'media-messages';
import { TransactionalMessageHandler } from 'pg-transactional-outbox';
import { Config } from '../../common';
import { RegisterContentTypeMessaging } from '../../messaging';
import {
  ChannelPublishedEventHandler,
  ChannelUnpublishedEventHandler,
  CheckChannelJobStatusFailedEventHandler,
  CheckChannelJobStatusSucceededEventHandler,
  LiveStreamProtectionKeyCreatedEventHandler,
} from './handlers';

export const registerChannelsMessaging: RegisterContentTypeMessaging =
  function (
    inboxWriter: RabbitMqInboxWriter,
    config: Config,
  ): RascalConfigBuilder[] {
    return [
      new RascalTransactionalConfigBuilder(
        ChannelServiceMultiTenantMessagingSettings.ChannelPublished,
        config,
      ).subscribeForEvent(() => inboxWriter),
      new RascalTransactionalConfigBuilder(
        ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished,
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
    new CheckChannelJobStatusSucceededEventHandler(config),
    new CheckChannelJobStatusFailedEventHandler(config),
    new LiveStreamProtectionKeyCreatedEventHandler(config),
  ];
};
