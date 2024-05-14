import {
  ImageServiceMultiTenantMessagingSettings,
  ImageTypesDeclareFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { ChannelTransactionalInboxMessageHandler } from '../transactional-outbox-inbox';

export class ImageTypesDeclareFailedHandler extends ChannelTransactionalInboxMessageHandler<ImageTypesDeclareFailedEvent> {
  constructor(config: Config) {
    super(
      ImageServiceMultiTenantMessagingSettings.ImageTypesDeclareFailed,
      new Logger({
        config,
        context: ImageTypesDeclareFailedHandler.name,
      }),
      config,
    );
  }

  handleMessage = async (
    message: TypedTransactionalMessage<ImageTypesDeclareFailedEvent>,
  ): Promise<void> => {
    if (message.payload.service_id !== this.config.serviceId) {
      return;
    }
    this.logger.error({
      message: 'Image types declare command has failed!',
      details: { ...message.payload },
    });
  };
}
