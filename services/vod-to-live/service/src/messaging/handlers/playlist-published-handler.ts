import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ChannelServiceMultiTenantMessagingSettings,
  DetailedVideo,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config, DAY_IN_SECONDS } from '../../common';
import {
  AzureStorage,
  CpixSettings,
  createDecryptionCpix,
  createEncryptionCpix,
  KeyServiceApi,
  PlaylistSmilGenerator,
} from '../../domains';
import {
  ChannelMetadataModel,
  convertObjectToXml,
  getPlaylistDurationInSeconds,
} from '../../domains/common';
import {
  generateChannelFilePath,
  getTransitionDateTime,
  metadataFileName,
} from '../../domains/live-stream/utils';
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
    const channelPublishedEvent: ChannelMetadataModel = JSON.parse(channelJson);
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

      const playlistTransitionDate = getTransitionDateTime(
        payload.start_date_time,
        this.config.catchUpDurationInMinutes,
      );
      const playlistDurationInSeconds = getPlaylistDurationInSeconds(
        payload.start_date_time,
        payload.end_date_time,
      );
      let encryptionDurationInSeconds = playlistDurationInSeconds;
      let encryptionStartDate = playlistTransitionDate;

      // Check if the playlist prolongation feature is on
      if (this.config.prolongPlaylistTo24Hours) {
        // encryption is performed on the fly, encryption startDate is set to playlist startDate
        encryptionStartDate = payload.start_date_time;
        // encryption is allowed for 24h or for playlist duration, if duration is bigger than 24h

        const prolongedPlaylistDurationInSeconds =
          DAY_IN_SECONDS + this.config.catchUpDurationInMinutes * 60;
        encryptionDurationInSeconds =
          playlistDurationInSeconds < DAY_IN_SECONDS
            ? prolongedPlaylistDurationInSeconds
            : playlistDurationInSeconds;
      }
      const encryptionParams = this.config.isDrmEnabled
        ? {
            startDate: new Date(encryptionStartDate),
            durationInSeconds: encryptionDurationInSeconds,
          }
        : undefined;
      const cpixSettings: CpixSettings = {
        decryptionCpixFile: await createDecryptionCpix(
          channelPublishedEvent.id,
          payload.id,
          {
            videos: [placeholderVideo, ...videos],
            // decryption starts immediately
            startDate: new Date(),
            // decryption is allowed for 24h
            durationInSeconds: DAY_IN_SECONDS,
          },
          this.storage,
          this.keyServiceApi,
        ),
        encryptionDashCpixFile: await createEncryptionCpix(
          channelPublishedEvent.id,
          'DASH',
          encryptionParams,
          this.storage,
        ),
        encryptionHlsCpixFile: await createEncryptionCpix(
          channelPublishedEvent.id,
          'HLS',
          encryptionParams,
          this.storage,
        ),
      };
      const generator = new PlaylistSmilGenerator(
        cpixSettings,
        this.config,
        placeholderVideo,
      );
      const smilDocument = generator.generate(payload);

      await this.broker.publish<PrepareTransitionLiveStreamCommand>(
        VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
          .messageType,
        {
          channel_id: payload.channel_id,
          playlist_id: payload.id,
          transition_start_date_time: playlistTransitionDate,
          smil: convertObjectToXml(smilDocument),
        },
        {
          auth_token: message.envelope.auth_token,
        },
      );
    } else {
      this.logger.error(
        `The placeholder video for channel ${payload.channel_id} could not be found.The playlist transition cannot be created.`,
      );
    }
  }
}
