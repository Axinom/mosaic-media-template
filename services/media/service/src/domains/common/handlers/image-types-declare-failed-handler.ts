import {
  ImageServiceMultiTenantMessagingSettings,
  ImageTypesDeclareFailedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessage,
  TransactionalInboxMessageHandler,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class ImageTypesDeclareFailedHandler extends TransactionalInboxMessageHandler<ImageTypesDeclareFailedEvent> {
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
  }: TransactionalInboxMessage<ImageTypesDeclareFailedEvent>): Promise<void> {
    this.logger.error({
      message: 'Image types declare command has failed!',
      details: { ...payload },
    });
  }
}
