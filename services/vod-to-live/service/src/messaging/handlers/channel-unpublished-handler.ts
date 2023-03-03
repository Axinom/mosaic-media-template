import { MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelServiceMultiTenantMessagingSettings,
  ChannelUnpublishedEvent,
} from '@axinom/mosaic-messages';
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
      ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished.messageType,
      config,
    );
  }
  async onMessage(
    payload: ChannelUnpublishedEvent,
    _message: MessageInfo,
  ): Promise<void> {
    await deleteChannelLiveStream(
      payload.id,
      this.virtualChannelApi,
      this.storage,
      this.keyServiceApi,
    );
  }
}
