import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import {
  PrepareChannelLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../common';
import { ChannelSmilGenerator, convertObjectToXml } from '../../domains';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class ChannelPublishedHandler extends AuthenticatedMessageHandler<ChannelPublishedEvent> {
  constructor(config: Config, private broker: Broker) {
    super(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType,
      config,
    );
  }
  async onMessage(
    payload: ChannelPublishedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const generator = new ChannelSmilGenerator();
    const smilEnvelope = generator.generate(payload);
    await this.broker.publish<PrepareChannelLiveStreamCommand>(
      VodToLiveServiceMessagingSettings.PrepareChannelLiveStream.messageType,
      {
        channel_id: payload.id,
        smil: convertObjectToXml(smilEnvelope),
        json: JSON.stringify(payload),
      },
      {
        auth_token: message.envelope.auth_token,
      },
    );
  }
}
