import { Broker, RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { ChannelServiceMultiTenantMessagingSettings } from '@axinom/mosaic-messages';
import { Express } from 'express';
import {
  EnsureChannelLiveCommand,
  PrepareChannelLiveStreamCommand,
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../common';
import { AzureStorage, KeyServiceApi, VirtualChannelApi } from '../domains';
import {
  ChannelPublishedHandler,
  ChannelUnpublishedHandler,
  EnsureChannelLiveHandler,
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
  keyServiceApi: KeyServiceApi,
): RascalConfigBuilder[] => {
  return [
    // Receive published and unpublished  events
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished,
      config,
    ).subscribeForEvent(
      (broker: Broker) =>
        new ChannelPublishedHandler(config, broker, keyServiceApi, storage),
    ),
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished,
      config,
    ).subscribeForEvent(
      () =>
        new ChannelUnpublishedHandler(
          config,
          storage,
          virtualChannelApi,
          keyServiceApi,
        ),
    ),
    new RascalConfigBuilder(
      ChannelServiceMultiTenantMessagingSettings.PlaylistPublished,
      config,
    ).subscribeForEvent(
      (broker: Broker) =>
        new PlaylistPublishedHandler(config, broker, storage, keyServiceApi),
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
          keyServiceApi,
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
            keyServiceApi,
          ),
      ),

    // Ensure Channel is Live
    new RascalConfigBuilder(
      VodToLiveServiceMessagingSettings.EnsureChannelLive,
      config,
    )
      .sendCommand()
      .subscribeForCommand<EnsureChannelLiveCommand>(
        (broker: Broker) =>
          new EnsureChannelLiveHandler(config, virtualChannelApi, broker),
      ),
    new RascalConfigBuilder(
      VodToLiveServiceMessagingSettings.EnsureChannelLiveFailed,
      config,
    ).publishEvent(),
    new RascalConfigBuilder(
      VodToLiveServiceMessagingSettings.EnsureChannelLiveReady,
      config,
    ).publishEvent(),

    // Channel Protection Key Created
    new RascalConfigBuilder(
      VodToLiveServiceMessagingSettings.LiveStreamProtectionKeyCreated,
      config,
    ).publishEvent(),
  ];
};
