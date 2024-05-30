import {
  CuePointTypesDeclaredEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class CuePointTypesDeclaredHandler extends TransactionalInboxMessageHandler<
  CuePointTypesDeclaredEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<CuePointTypesDeclaredEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.log({
        message: 'Cue point types declare command has succeeded!',
        details: { ...payload },
      });
    }
  }
}
