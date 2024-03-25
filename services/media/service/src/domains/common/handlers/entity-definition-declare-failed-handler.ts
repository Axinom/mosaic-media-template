import {
  EntityDefinitionDeclareFailedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class EntityDefinitionDeclareFailedHandler extends TransactionalInboxMessageHandler<
  EntityDefinitionDeclareFailedEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<EntityDefinitionDeclareFailedEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.error({
        message: 'Entity definition declare command has failed!',
        details: { ...payload },
      });
    }
  }
}
