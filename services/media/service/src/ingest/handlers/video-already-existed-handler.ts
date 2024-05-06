import {
  EnsureVideoExistsAlreadyExistedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';
export class VideoAlreadyExistedHandler extends VideoSucceededHandler<EnsureVideoExistsAlreadyExistedEvent> {
  constructor(entityProcessors: IngestEntityProcessor[], config: Config) {
    super(
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted,
      config,
    );
  }
  fallbackErrorMessage =
    'The video already existed, but there was an error adding that video to the entity.';
}
