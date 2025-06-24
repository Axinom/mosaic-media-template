import {
  EnsureVideoExistsCreationStartedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';

export class VideoCreationStartedHandler extends VideoSucceededHandler<EnsureVideoExistsCreationStartedEvent> {
  constructor(
    storeOutboxMessage: StoreOutboxMessage,
    entityProcessors: IngestEntityProcessor[],
    config: Config,
  ) {
    super(
      storeOutboxMessage,
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsCreationStarted,
      config,
    );
  }
}
