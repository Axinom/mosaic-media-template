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
  generateCpixSettings,
  KeyServiceApi,
  PlaylistSmilGenerator,
} from '../../domains';
import {
  generateChannelFilePath,
  isFutureDate,
  metadataFileName,
} from '../../domains/live-stream/utils';
import { convertObjectToXml } from '../../domains/utils';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class PlaylistPublishedHandler extends AuthenticatedMessageHandler<PlaylistPublishedEvent> {
  private logger: Logger;
  constructor(
    config: Config,
    private broker: Broker,
    private storage: AzureStorage,
    private keyServiceApi: KeyServiceApi,
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
      generateChannelFilePath(payload.channel_id, metadataFileName),
    );
    const channelPublishedEvent: ChannelPublishedEvent =
      JSON.parse(channelJson);
    const placeholderVideo: DetailedVideo | undefined =
      channelPublishedEvent?.placeholder_video;

    if (placeholderVideo) {
      const videos =
        payload.programs?.reduce((result, entry) => {
          let scheduleResult: DetailedVideo[] = [];
          if (entry.program_cue_points) {
            scheduleResult = entry.program_cue_points
              .flatMap((cp) => cp.schedules)
              .reduce((result, schedule) => {
                if (schedule?.video) {
                  return [...result, schedule.video];
                }
                return result;
              }, new Array<DetailedVideo>());
          }
          return [...result, entry.video, ...scheduleResult];
        }, new Array<DetailedVideo>()) ?? [];

      const settingAccessStartDate = isFutureDate(payload.start_date_time)
        ? new Date(payload.start_date_time)
        : new Date();
      const settingAccessDuration = Math.abs(
        (new Date(payload.end_date_time).getTime() -
          new Date(payload.start_date_time).getTime()) /
          1000,
      );
      const drmSettings = await generateCpixSettings(
        [placeholderVideo, ...videos],
        true,
        this.storage,
        this.keyServiceApi,
        settingAccessStartDate,
        settingAccessDuration,
        channelPublishedEvent.id,
        payload.id,
      );

      const generator = new PlaylistSmilGenerator(
        drmSettings,
        placeholderVideo,
      );
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
    } else {
      this.logger.error(
        `Placeholder video for channel ${payload.channel_id} was not found. Playlist transition will not be created.`,
      );
    }
  }
}
