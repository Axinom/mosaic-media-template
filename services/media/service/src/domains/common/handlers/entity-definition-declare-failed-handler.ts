import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  EntityDefinitionDeclareFailedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../../common';

export class EntityDefinitionDeclareFailedHandler extends MessageHandler<EntityDefinitionDeclareFailedEvent> {
  private logger: Logger;
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings
        .EntityDefinitionDeclareFailed.messageType,
    );
    this.logger = new Logger({
      config,
      context: EntityDefinitionDeclareFailedHandler.name,
    });
  }

  async onMessage(content: EntityDefinitionDeclareFailedEvent): Promise<void> {
    this.logger.error({
      message: 'Entity definition declare command has failed!',
      details: { ...content },
    });
  }
}
