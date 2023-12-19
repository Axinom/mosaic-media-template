import {
  CuePointTypesDeclaredEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessage,
  TransactionalInboxMessageHandler,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class CuePointTypesDeclaredHandler extends TransactionalInboxMessageHandler<CuePointTypesDeclaredEvent> {
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
  }: TransactionalInboxMessage<CuePointTypesDeclaredEvent>): Promise<void> {
    this.logger.log({
      message: 'Cue point types declare command has succeeded!',
      details: { ...payload },
    });
  }
}
