import {
  ImageServiceMultiTenantMessagingSettings,
  ImageTypesDeclaredEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class ImageTypesDeclaredHandler extends TransactionalInboxMessageHandler<
  ImageTypesDeclaredEvent,
  Config
> {
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

  async handleMessage({
    payload,
  }: TypedTransactionalMessage<ImageTypesDeclaredEvent>): Promise<void> {
    if (payload.service_id === this.config.serviceId) {
      this.logger.log({
        message: 'Image types declare command has succeeded!',
        details: { ...payload },
      });
    }
  }
}
