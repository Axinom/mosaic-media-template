import {
  EntityDefinitionDeleteFailedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class EntityDefinitionDeleteFailedHandler extends TransactionalInboxMessageHandler<
  EntityDefinitionDeleteFailedEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<EntityDefinitionDeleteFailedEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.error({
        message: 'Entity definition delete command has failed!',
        details: { ...payload },
      });
    }
  }
}
