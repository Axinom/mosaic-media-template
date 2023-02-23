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
import {
  AzureStorage,
  ChannelSmilGenerator,
  generateCpixSettings,
  KeyServiceApi,
} from '../../domains';
import { convertObjectToXml } from '../../domains/utils';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class ChannelPublishedHandler extends AuthenticatedMessageHandler<ChannelPublishedEvent> {
  constructor(
    config: Config,
    private broker: Broker,
    private keyServiceApi: KeyServiceApi,
    private azureStorage: AzureStorage,
  ) {
    super(
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType,
      config,
    );
  }
  async onMessage(
    payload: ChannelPublishedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const drmSettings = await generateCpixSettings(
      payload.placeholder_video ? [payload.placeholder_video] : [],
      false,
      this.azureStorage,
      this.keyServiceApi,
      new Date(),
      payload.placeholder_video?.video_encoding?.length_in_seconds ?? 0,
      payload.id,
    );

    const generator = new ChannelSmilGenerator(drmSettings);
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
