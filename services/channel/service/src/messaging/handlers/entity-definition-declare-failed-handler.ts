import {
  EntityDefinitionDeclareFailedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class EntityDefinitionDeclareFailedHandler extends ChannelTransactionalInboxMessageHandler<EntityDefinitionDeclareFailedEvent> {
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFailed,
      new Logger({
        config,
        context: EntityDefinitionDeclareFailedHandler.name,
      }),
      config,
    );
  }
  async handleMessage(
    message: TypedTransactionalMessage<EntityDefinitionDeclareFailedEvent>,
  ): Promise<void> {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }
    this.logger.error({
      message: 'Entity definition declare command has failed!',
      details: { ...message.payload },
    });
  }
}
