import {
  EnsureImageExistsImageCreatedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { ImageSucceededHandler } from './image-succeeded-handler';

export class ImageCreatedHandler extends ImageSucceededHandler<EnsureImageExistsImageCreatedEvent> {
  constructor(entityProcessors: IngestEntityProcessor[], config: Config) {
    super(
      entityProcessors,
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsImageCreated,
      config,
    );
  }

  fallbackErrorMessage =
    'The image was correctly imported, but there was an error adding that image to the entity.';
}
