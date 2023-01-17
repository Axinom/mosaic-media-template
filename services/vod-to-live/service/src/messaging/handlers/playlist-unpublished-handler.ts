import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelServiceMultiTenantMessagingSettings,
  PlaylistUnpublishedEvent,
} from '@axinom/mosaic-messages';
import { Config } from '../../common';
import {
  AzureStorage,
  deleteTransitionLiveStream,
  VirtualChannelApi,
} from '../../domains';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class PlaylistUnpublishedHandler extends AuthenticatedMessageHandler<PlaylistUnpublishedEvent> {
  constructor(
    config: Config,
    private storage: AzureStorage,
    private broker: Broker,
    private virtualChannelApi: VirtualChannelApi,
  ) {
    super(
      ChannelServiceMultiTenantMessagingSettings.PlaylistUnpublished
        .messageType,
      config,
    );
  }
  async onMessage(
    payload: PlaylistUnpublishedEvent,
    messageInfo: MessageInfo,
  ): Promise<void> {
    await deleteTransitionLiveStream(
      payload.channel_id,
      payload.id,
      this.virtualChannelApi,
      this.storage,
      this.broker,
      messageInfo?.envelope?.auth_token ?? '',
    );
  }
}
