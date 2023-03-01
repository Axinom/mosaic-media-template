import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import {
  PrepareChannelLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config, DAY_IN_SECONDS } from '../../common';
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
      payload.id,
      null,
      {
        videos: payload.placeholder_video ? [payload.placeholder_video] : [],
        startDate: new Date(),
        durationInSeconds: DAY_IN_SECONDS,
      },
      null,
      this.azureStorage,
      this.keyServiceApi,
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
