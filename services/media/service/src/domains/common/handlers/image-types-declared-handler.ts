import {
  ImageServiceMultiTenantMessagingSettings,
  ImageTypesDeclaredEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessage,
  TransactionalInboxMessageHandler,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../../common';

export class ImageTypesDeclaredHandler extends TransactionalInboxMessageHandler<ImageTypesDeclaredEvent> {
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
  }: TransactionalInboxMessage<ImageTypesDeclaredEvent>): Promise<void> {
    this.logger.log({
      message: 'Image types declare command has succeeded!',
      details: { ...payload },
    });
  }
}
