import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  CuePointTypesDeclaredEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../../common';

export class CuePointTypesDeclaredHandler extends MessageHandler<CuePointTypesDeclaredEvent> {
  private logger: Logger;
  constructor(private config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclared
        .messageType,
    );
    this.logger = new Logger({
      config,
      context: CuePointTypesDeclaredHandler.name,
    });
  }

  async onMessage(content: CuePointTypesDeclaredEvent): Promise<void> {
    if (content.service_id === this.config.serviceId) {
      this.logger.log({
        message: 'Cue point types declare command has succeeded!',
        details: { ...content },
      });
    }
  }
}
