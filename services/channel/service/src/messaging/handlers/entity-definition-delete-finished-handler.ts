import {
  EntityDefinitionDeleteFinishedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class EntityDefinitionDeleteFinishedHandler extends ChannelTransactionalInboxMessageHandler<EntityDefinitionDeleteFinishedEvent> {
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFinished,
      new Logger({
        config,
        context: EntityDefinitionDeleteFinishedHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    message: TypedTransactionalMessage<EntityDefinitionDeleteFinishedEvent>,
  ): Promise<void> {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }
    this.logger.log({
      message: 'Entity Definition delete command has succeeded!',
      details: { ...message.payload },
    });
  }
}
