import {
  CuePointTypesDeclareFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class CuePointTypesDeclareFailedHandler extends TransactionalInboxMessageHandler<
  CuePointTypesDeclareFailedEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<CuePointTypesDeclareFailedEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.error({
        message: 'Cue point types declare command has failed!',
        details: { ...payload },
      });
    }
  }
}
