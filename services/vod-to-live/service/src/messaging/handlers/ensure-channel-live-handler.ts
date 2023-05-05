import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { Logger, sleep } from '@axinom/mosaic-service-common';
import {
  EnsureChannelLiveCommand,
  EnsureChannelLiveFailedEvent,
  EnsureChannelLiveReadyEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { VirtualChannelApi } from 'src/domains';
import urljoin from 'url-join';
import { Config } from '../../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class EnsureChannelLiveHandler extends AuthenticatedMessageHandler<EnsureChannelLiveCommand> {
  private logger: Logger;
  constructor(
    config: Config,
    private virtualChannelApi: VirtualChannelApi,
    private broker: Broker,
  ) {
    super(
      VodToLiveServiceMessagingSettings.EnsureChannelLive.messageType,
      config,
    );
    this.logger = new Logger({
      config: this.config,
      context: EnsureChannelLiveHandler.name,
    });
  }
  async onMessage(
    { channel_id, seconds_elapsed_while_waiting }: EnsureChannelLiveCommand,
    message: MessageInfo,
  ): Promise<void> {
    // request status
    const channelStatus = await this.virtualChannelApi.getChannelStatus(
      channel_id,
    );

    if (channelStatus.status === 'Success') {
      const dashUrl = urljoin(
        this.config.virtualChannelOriginBaseUrl,
        `${channel_id}.isml`,
        '.mpd',
      );
      const hlsUrl = urljoin(
        this.config.virtualChannelOriginBaseUrl,
        `${channel_id}.isml`,
        '.m3u8',
      );
      this.logger.log({
        message: `Channel ${channel_id} successfully went live.`,
        details: {
          dashUrl,
          hlsUrl,
        },
      });
      await this.broker.publish<EnsureChannelLiveReadyEvent>(
        VodToLiveServiceMessagingSettings.EnsureChannelLiveReady.messageType,
        {
          channel_id,
          dash_stream_url: dashUrl,
          hls_stream_url: hlsUrl,
        },
        { auth_token: message.envelope.auth_token },
      );
      return;
    } else if (channelStatus.status === 'Failed') {
      const uspErrors = channelStatus.details
        .filter((d) => d.status === 'Failed')
        .map(
          (failed) => `Failed task: ${failed.name}. Details: ${failed.details}`,
        );

      this.logger.error({
        message: `Channel ${channel_id} failed to go live.`,
        details: {
          uspErrors,
        },
      });

      await this.broker.publish<EnsureChannelLiveFailedEvent>(
        VodToLiveServiceMessagingSettings.EnsureChannelLiveFailed.messageType,
        { channel_id, message: uspErrors.toString() },
        { auth_token: message.envelope.auth_token },
      );
      return;
    } else {
      seconds_elapsed_while_waiting += 5;
      if (
        seconds_elapsed_while_waiting >=
        this.config.channelProcessingWaitTimeInSeconds
      ) {
        this.logger.error({
          message: `Channel ${channel_id} failed to go live.`,
          details: {
            errorMessage: `The channel ${channel_id} has taken more than ${this.config.channelProcessingWaitTimeInSeconds} seconds to go live.`,
          },
        });

        await this.broker.publish<EnsureChannelLiveFailedEvent>(
          VodToLiveServiceMessagingSettings.EnsureChannelLiveFailed.messageType,
          {
            channel_id,
            message: `The channel ${channel_id} has taken more than ${this.config.channelProcessingWaitTimeInSeconds} seconds to go live.`,
          },
          { auth_token: message.envelope.auth_token },
        );
        return;
      }

      await sleep(5000);
      await this.broker.publish<EnsureChannelLiveCommand>(
        VodToLiveServiceMessagingSettings.EnsureChannelLive.messageType,
        {
          seconds_elapsed_while_waiting,
          channel_id,
        },
        { auth_token: message.envelope.auth_token },
      );
    }
  }
}
