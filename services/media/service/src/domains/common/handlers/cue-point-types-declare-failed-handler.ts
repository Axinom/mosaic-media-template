import {
  CuePointTypesDeclareFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessage,
  TransactionalInboxMessageHandler,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class CuePointTypesDeclareFailedHandler extends TransactionalInboxMessageHandler<CuePointTypesDeclareFailedEvent> {
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
  }: TransactionalInboxMessage<CuePointTypesDeclareFailedEvent>): Promise<void> {
    this.logger.error({
      message: 'Cue point types declare command has failed!',
      details: { ...payload },
    });
  }
}
