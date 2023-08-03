import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  CuePointTypesDeclareFailedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../../common';

export class CuePointTypesDeclareFailedHandler extends MessageHandler<CuePointTypesDeclareFailedEvent> {
  private logger: Logger;
  constructor(private config: Config) {
    super(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclareFailed
        .messageType,
    );
    this.logger = new Logger({
      config,
      context: CuePointTypesDeclareFailedHandler.name,
    });
  }

  async onMessage(content: CuePointTypesDeclareFailedEvent): Promise<void> {
    if (content.service_id === this.config.serviceId) {
      this.logger.error({
        message: 'Cue point types declare command has failed!',
        details: { ...content },
      });
    }
  }
}
