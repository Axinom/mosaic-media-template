import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  PrepareChannelLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../common';
import {
  AzureStorage,
  KeyServiceApi,
  prepareChannelLiveStream,
  VirtualChannelApi,
} from '../../domains';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class PrepareChannelLiveStreamHandler extends AuthenticatedMessageHandler<PrepareChannelLiveStreamCommand> {
  constructor(
    config: Config,
    private storage: AzureStorage,
    private broker: Broker,
    private virtualChannelApi: VirtualChannelApi,
    private keyServiceApi: KeyServiceApi,
  ) {
    super(
      VodToLiveServiceMessagingSettings.PrepareChannelLiveStream.messageType,
      config,
    );
  }
  async onMessage(
    payload: PrepareChannelLiveStreamCommand,
    message: MessageInfo,
  ): Promise<void> {
    await prepareChannelLiveStream(
      payload.channel_id,
      payload.is_drm_protected,
      payload.smil,
      payload.json,
      this.virtualChannelApi,
      this.storage,
      this.keyServiceApi,
      this.broker,
      message.envelope.auth_token,
    );
  }
}
