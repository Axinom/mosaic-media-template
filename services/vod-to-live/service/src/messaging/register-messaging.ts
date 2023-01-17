import { Broker, RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { ChannelServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { Express } from 'express';
import {
  PrepareChannelLiveStreamCommand,
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../common';
import { AzureStorage, VirtualChannelApi } from '../domains';
import {
  ChannelPublishedHandler,
  ChannelUnpublishedHandler,
  PlaylistPublishedHandler,
  PlaylistUnpublishedHandler,
  PrepareChannelLiveStreamHandler,
  PrepareTransitionLiveStreamHandler,
} from './handlers';

export const registerMessaging = (
  app: Express,
  config: Config,
  storage: AzureStorage,
  virtualChannelApi: VirtualChannelApi,
): RascalConfigBuilder[] => {
  return [
    // Receive published and unpublished  events
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished,
      config,
    ).subscribeForEvent(
      (broker: Broker) => new ChannelPublishedHandler(config, broker),
    ),
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished,
      config,
    ).subscribeForEvent(
      () => new ChannelUnpublishedHandler(config, storage, virtualChannelApi),
    ),
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.PlaylistPublished,
      config,
    ).subscribeForEvent(
      (broker: Broker) => new PlaylistPublishedHandler(config, broker, storage),
    ),
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.PlaylistUnpublished,
      config,
    ).subscribeForEvent(
      (broker: Broker) =>
        new PlaylistUnpublishedHandler(
          config,
          storage,
          broker,
          virtualChannelApi,
        ),
    ),

    // Playlist-to-Live-stream
    new RascalConfigBuilder(
      VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream,
      config,
    )
      .sendCommand()
      .subscribeForCommand<PrepareTransitionLiveStreamCommand>(
        () => new PrepareTransitionLiveStreamHandler(config, virtualChannelApi),
      ),
    // Channel-to-Live-stream
    new RascalConfigBuilder(
      VodToLiveServiceMessagingSettings.PrepareChannelLiveStream,
      config,
    )
      .sendCommand()
      .subscribeForCommand<PrepareChannelLiveStreamCommand>(
        (broker: Broker) =>
          new PrepareChannelLiveStreamHandler(
            config,
            storage,
            broker,
            virtualChannelApi,
          ),
      ),
  ];
};
