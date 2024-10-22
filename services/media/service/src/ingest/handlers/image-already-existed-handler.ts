import {
  EnsureImageExistsAlreadyExistedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { ImageSucceededHandler } from './image-succeeded-handler';

export class ImageAlreadyExistedHandler extends ImageSucceededHandler<EnsureImageExistsAlreadyExistedEvent> {
  constructor(entityProcessors: IngestEntityProcessor[], config: Config) {
    super(
      entityProcessors,
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsAlreadyExisted,
      config,
    );
  }
}
