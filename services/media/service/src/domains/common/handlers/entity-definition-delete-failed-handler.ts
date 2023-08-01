import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  EntityDefinitionDeleteFailedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../../common';

export class EntityDefinitionDeleteFailedHandler extends MessageHandler<EntityDefinitionDeleteFailedEvent> {
  private logger: Logger;
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings
        .EntityDefinitionDeleteFailed.messageType,
    );
    this.logger = new Logger({
      config,
      context: EntityDefinitionDeleteFailedHandler.name,
    });
  }

  async onMessage(content: EntityDefinitionDeleteFailedEvent): Promise<void> {
    this.logger.error({
      message: 'Entity definition delete command has failed!',
      details: { ...content },
    });
  }
}
