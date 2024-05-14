import {
  EntityDefinitionDeleteFailedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class EntityDefinitionDeleteFailedHandler extends ChannelTransactionalInboxMessageHandler<EntityDefinitionDeleteFailedEvent> {
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFailed,
      new Logger({
        config,
        context: EntityDefinitionDeleteFailedHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    message: TypedTransactionalMessage<EntityDefinitionDeleteFailedEvent>,
  ): Promise<void> {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }
    this.logger.error({
      message: 'Entity definition delete command has failed!',
      details: { ...message.payload },
    });
  }
}
