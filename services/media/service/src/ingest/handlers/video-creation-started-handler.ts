import {
  EnsureVideoExistsCreationStartedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreInboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';

export class VideoCreationStartedHandler extends VideoSucceededHandler<EnsureVideoExistsCreationStartedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    storeInboxMessage: StoreInboxMessage,
    config: Config,
  ) {
    super(
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsCreationStarted,
      storeInboxMessage,
      config,
    );
  }
}
