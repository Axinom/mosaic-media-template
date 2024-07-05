import {
  EntityDefinitionDeclareFinishedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class EntityDefinitionDeclareFinishedHandler extends TransactionalInboxMessageHandler<
  EntityDefinitionDeclareFinishedEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<EntityDefinitionDeclareFinishedEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.log({
        message: 'Entity Definition declare command has succeeded!',
        details: { ...payload },
      });
    }
  }
}
