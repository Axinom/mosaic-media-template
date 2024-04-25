import {
  EnsureImageExistsAlreadyExistedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { ImageSucceededHandler } from './image-succeeded-handler';

export class ImageAlreadyExistedHandler extends ImageSucceededHandler<EnsureImageExistsAlreadyExistedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    storeInboxMessage: StoreInboxMessage,
    config: Config,
  ) {
    super(
      entityProcessors,
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsAlreadyExisted,
      storeInboxMessage,
      config,
    );
  }
}
