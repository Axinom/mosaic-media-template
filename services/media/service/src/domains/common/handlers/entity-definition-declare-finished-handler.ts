import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  EntityDefinitionDeclareFinishedEvent,
  LocalizationServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../../common';

export class EntityDefinitionDeclareFinishedHandler extends MessageHandler<EntityDefinitionDeclareFinishedEvent> {
  private logger: Logger;
  constructor(config: Config) {
    super(
      LocalizationServiceMultiTenantMessagingSettings
        .EntityDefinitionDeclareFinished.messageType,
    );
    this.logger = new Logger({
      config,
      context: EntityDefinitionDeclareFinishedHandler.name,
    });
  }

  async onMessage(
    content: EntityDefinitionDeclareFinishedEvent,
  ): Promise<void> {
    this.logger.log({
      message: 'Entity Definition declare command has succeeded!',
      details: { ...content },
    });
  }
}
