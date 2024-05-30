import {
  EnsureImageExistsImageCreatedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { ImageSucceededHandler } from './image-succeeded-handler';

export class ImageCreatedHandler extends ImageSucceededHandler<EnsureImageExistsImageCreatedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      entityProcessors,
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsImageCreated,
      storeOutboxMessage,
      config,
    );
  }
}
