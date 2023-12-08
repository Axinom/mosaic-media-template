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
  CpixSettings,
  createDecryptionCpix,
  KeyServiceApi,
} from '../../domains';
import { convertObjectToXml } from '../../domains/common';
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
    const cpixSettings: CpixSettings = {
      decryptionCpixFile: await createDecryptionCpix(
        payload.id,
        null,
        {
          videos: payload.placeholder_video ? [payload.placeholder_video] : [],
          startDate: new Date(),
          durationInSeconds: DAY_IN_SECONDS,
        },
        this.azureStorage,
        this.keyServiceApi,
      ),
      // live stream with only Placeholder Video is never protected
      encryptionDashCpixFile: undefined,
      encryptionHlsCpixFile: undefined,
    };
    const generator = new ChannelSmilGenerator(cpixSettings);
    const smilEnvelope = generator.generate(payload);
    await this.broker.publish<PrepareChannelLiveStreamCommand>(
      payload.id,
      VodToLiveServiceMessagingSettings.PrepareChannelLiveStream,
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
