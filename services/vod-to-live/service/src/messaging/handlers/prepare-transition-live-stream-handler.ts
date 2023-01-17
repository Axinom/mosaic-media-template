import { MessageInfo } from '@axinom/mosaic-message-bus';
import {
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../common';
import { prepareTransitionLiveStream, VirtualChannelApi } from '../../domains';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class PrepareTransitionLiveStreamHandler extends AuthenticatedMessageHandler<PrepareTransitionLiveStreamCommand> {
  constructor(config: Config, private virtualChannelApi: VirtualChannelApi) {
    super(
      VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream.messageType,
      config,
    );
  }
  async onMessage(
    payload: PrepareTransitionLiveStreamCommand,
    _message: MessageInfo,
  ): Promise<void> {
    await prepareTransitionLiveStream(
      payload.channel_id,
      payload.playlist_id,
      payload.playlist_start_date_time,
      payload.smil,
      this.virtualChannelApi,
    );
  }
}
