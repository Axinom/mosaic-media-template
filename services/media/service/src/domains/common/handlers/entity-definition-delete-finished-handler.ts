import {
  EntityDefinitionDeleteFinishedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class EntityDefinitionDeleteFinishedHandler extends TransactionalInboxMessageHandler<
  EntityDefinitionDeleteFinishedEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<EntityDefinitionDeleteFinishedEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.log({
        message: 'Entity Definition delete command has succeeded!',
        details: { ...payload },
      });
    }
  }
}
