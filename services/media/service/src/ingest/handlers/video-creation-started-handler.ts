import {
  EnsureVideoExistsCreationStartedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';

export class VideoCreationStartedHandler extends VideoSucceededHandler<EnsureVideoExistsCreationStartedEvent> {
  constructor(entityProcessors: IngestEntityProcessor[], config: Config) {
    super(
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsCreationStarted,
      config,
    );
  }
}
