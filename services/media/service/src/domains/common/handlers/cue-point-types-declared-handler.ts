import { MessageHandler } from '@axinom/mosaic-message-bus';
import {
  CuePointTypesDeclaredEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../../common';

export class CuePointTypesDeclaredHandler extends MessageHandler<CuePointTypesDeclaredEvent> {
  private logger: Logger;
  constructor(config: Config) {
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
    this.logger.log({
      message: 'Cue point types declare command has succeeded!',
      details: { ...content },
    });
  }
}
