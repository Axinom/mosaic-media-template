import { MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelServiceMessagingSettings,
  ChannelUnpublishedEvent,
} from 'media-messages';
import { Config } from '../../common';
import {
  AzureStorage,
  deleteChannelLiveStream,
  KeyServiceApi,
  VirtualChannelApi,
} from '../../domains';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class ChannelUnpublishedHandler extends AuthenticatedMessageHandler<ChannelUnpublishedEvent> {
  constructor(
    config: Config,
    private storage: AzureStorage,
    private virtualChannelApi: VirtualChannelApi,
    private keyServiceApi: KeyServiceApi,
  ) {
    super(
      ChannelServiceMessagingSettings.ChannelUnpublished.messageType,
      config,
    );
  }
  async onMessage(
    payload: ChannelUnpublishedEvent,
    _message: MessageInfo,
  ): Promise<void> {
    await deleteChannelLiveStream(
      payload.content_id,
      this.virtualChannelApi,
      this.storage,
      this.keyServiceApi,
    );
  }
}
