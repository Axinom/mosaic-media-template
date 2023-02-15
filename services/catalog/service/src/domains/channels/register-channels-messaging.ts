import { LoginPgPool } from '@axinom/mosaic-db-common';
import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { ChannelServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { Config } from '../../common';
import { ContentTypeRegistrant } from '../../messaging';
import {
  ChannelPublishedEventHandler,
  ChannelUnpublishedEventHandler,
} from './handlers';

export const registerChannelsMessaging: ContentTypeRegistrant = function (
  config: Config,
  loginPool: LoginPgPool,
) {
  return [
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished,
      config,
    ).subscribeForEvent(
      () => new ChannelPublishedEventHandler(loginPool, config),
    ),
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished,
      config,
    ).subscribeForEvent(
      () => new ChannelUnpublishedEventHandler(loginPool, config),
    ),
  ];
};
