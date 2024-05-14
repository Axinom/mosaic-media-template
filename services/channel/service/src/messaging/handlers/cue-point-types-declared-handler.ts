import {
  CuePointTypesDeclaredEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class CuePointTypesDeclaredHandler extends ChannelTransactionalInboxMessageHandler<CuePointTypesDeclaredEvent> {
  constructor(config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclared,
      new Logger({
        config,
        context: CuePointTypesDeclaredHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    message: TypedTransactionalMessage<CuePointTypesDeclaredEvent>,
  ): Promise<void> {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }
    this.logger.log({
      message: 'Cue point types declare command has succeeded!',
      details: { ...message.payload },
    });
  }
}
