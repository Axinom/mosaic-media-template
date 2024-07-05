import {
  ImageServiceMultiTenantMessagingSettings,
  ImageTypesDeclareFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class ImageTypesDeclareFailedHandler extends TransactionalInboxMessageHandler<
  ImageTypesDeclareFailedEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<ImageTypesDeclareFailedEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.error({
        message: 'Image types declare command has failed!',
        details: { ...payload },
      });
    }
  }
}
