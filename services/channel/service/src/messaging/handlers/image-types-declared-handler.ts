import {
  ImageServiceMultiTenantMessagingSettings,
  ImageTypesDeclaredEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class ImageTypesDeclaredHandler extends ChannelTransactionalInboxMessageHandler<ImageTypesDeclaredEvent> {
  constructor(config: Config) {
    super(
      ImageServiceMultiTenantMessagingSettings.ImageTypesDeclared,
      new Logger({
        config,
        context: ImageTypesDeclaredHandler.name,
      }),
      config,
    );
  }

  handleMessage = async (
    message: TypedTransactionalMessage<ImageTypesDeclaredEvent>,
  ): Promise<void> => {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }
    this.logger.log({
      message: 'Image types declare command has succeeded!',
      details: { ...message.payload },
    });
  };
}
