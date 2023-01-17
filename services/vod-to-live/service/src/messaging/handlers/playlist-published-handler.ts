import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
  DetailedVideo,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../common';
import {
  AzureStorage,
  convertObjectToXml,
  PlaylistSmilGenerator,
} from '../../domains';
import { generateChannelStorageName } from '../../domains/live-stream/utils';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class PlaylistPublishedHandler extends AuthenticatedMessageHandler<PlaylistPublishedEvent> {
  private logger: Logger;
  constructor(
    config: Config,
    private broker: Broker,
    private storage: AzureStorage,
  ) {
    super(
      ChannelServiceMultiTenantMessagingSettings.PlaylistPublished.messageType,
      config,
    );
    this.logger = new Logger({
      config,
      context: PlaylistPublishedHandler.name,
    });
  }
  async onMessage(
    payload: PlaylistPublishedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const channelJson = await this.storage.getFileContent(
      generateChannelStorageName(payload.channel_id),
    );
    const channelPublishedEvent: ChannelPublishedEvent =
      JSON.parse(channelJson);
    const placeholderVideo: DetailedVideo | undefined =
      channelPublishedEvent?.placeholder_video;

    if (placeholderVideo) {
      const generator = new PlaylistSmilGenerator(placeholderVideo);
      const smilDocument = generator.generate(payload);
      await this.broker.publish<PrepareTransitionLiveStreamCommand>(
        VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
          .messageType,
        {
          channel_id: payload.channel_id,
          playlist_id: payload.id,
          playlist_start_date_time: payload.start_date_time,
          smil: convertObjectToXml(smilDocument),
        },
        {
          auth_token: message.envelope.auth_token,
        },
      );

      this.logger.error(
        `Placeholder video for channel ${payload.channel_id} was not found. Playlist transition will not be created.`,
      );
    }
  }
}
