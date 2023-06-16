import { Logger } from '@axinom/mosaic-service-common';
import {
  CheckChannelJobStatusFailedEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class CheckChannelJobStatusFailedEventHandler extends AuthenticatedMessageHandler<CheckChannelJobStatusFailedEvent> {
  private logger: Logger;
  constructor(protected readonly config: Config) {
    super(
      VodToLiveServiceMessagingSettings.CheckChannelJobStatusFailed.messageType,
      config,
    );
    this.logger = new Logger({
      config,
      context: CheckChannelJobStatusFailedEventHandler.name,
    });
  }

  async onMessage(payload: CheckChannelJobStatusFailedEvent): Promise<void> {
    this.logger.error({
      message:
        'Job status check has failed for the channel. See details for more info.',
      details: { ...payload },
    });
  }
}
