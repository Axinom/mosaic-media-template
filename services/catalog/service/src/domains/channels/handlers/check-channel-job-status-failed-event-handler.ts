import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckChannelJobStatusFailedEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../../common';

export class CheckChannelJobStatusFailedEventHandler extends TransactionalInboxMessageHandler<
  CheckChannelJobStatusFailedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      VodToLiveServiceMessagingSettings.CheckChannelJobStatusFailed,
      new Logger({
        config,
        context: CheckChannelJobStatusFailedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage({
    payload,
  }: TypedTransactionalMessage<CheckChannelJobStatusFailedEvent>): Promise<void> {
    this.logger.error({
      message:
        'Job status check has failed for the channel. See details for more info.',
      details: { ...payload },
    });
  }
}
