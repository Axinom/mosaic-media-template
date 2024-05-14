import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelServiceMessagingSettings,
  PlaylistUnpublishedEvent,
} from 'media-messages';
import { Config } from '../../common';
import {
  AzureStorage,
  deleteTransitionLiveStream,
  KeyServiceApi,
  VirtualChannelApi,
} from '../../domains';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class PlaylistUnpublishedHandler extends AuthenticatedMessageHandler<PlaylistUnpublishedEvent> {
  constructor(
    config: Config,
    private storage: AzureStorage,
    private broker: Broker,
    private virtualChannelApi: VirtualChannelApi,
    private keyServiceApi: KeyServiceApi,
  ) {
    super(
      ChannelServiceMessagingSettings.PlaylistUnpublished.messageType,
      config,
    );
  }
  async onMessage(
    payload: PlaylistUnpublishedEvent,
    messageInfo: MessageInfo,
  ): Promise<void> {
    await deleteTransitionLiveStream(
      payload.channel_id,
      payload.content_id,
      this.virtualChannelApi,
      this.storage,
      this.keyServiceApi,
      this.broker,
      messageInfo?.envelope?.auth_token ?? '',
    );
  }
}
