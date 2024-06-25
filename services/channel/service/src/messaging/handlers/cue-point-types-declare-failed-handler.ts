import {
  CuePointTypesDeclareFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class CuePointTypesDeclareFailedHandler extends ChannelTransactionalInboxMessageHandler<CuePointTypesDeclareFailedEvent> {
  constructor(config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclareFailed,
      new Logger({
        config,
        context: CuePointTypesDeclareFailedHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    message: TypedTransactionalMessage<CuePointTypesDeclareFailedEvent>,
  ): Promise<void> {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }

    this.logger.error({
      message: 'Cue point types declare command has failed!',
      details: { ...message.payload },
    });
  }
}
