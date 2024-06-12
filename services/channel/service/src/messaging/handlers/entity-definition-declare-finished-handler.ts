import {
  EntityDefinitionDeclareFinishedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class EntityDefinitionDeclareFinishedHandler extends ChannelTransactionalInboxMessageHandler<EntityDefinitionDeclareFinishedEvent> {
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFinished,
      new Logger({
        config,
        context: EntityDefinitionDeclareFinishedHandler.name,
      }),
      config,
    );
  }

  async handleMessage(
    message: TypedTransactionalMessage<EntityDefinitionDeclareFinishedEvent>,
  ): Promise<void> {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }
    this.logger.log({
      message: 'Entity Definition declare command has succeeded!',
      details: { ...message.payload },
    });
  }
}
