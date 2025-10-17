import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  EnsureVideoExistsAlreadyExistedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-video-messages';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';
export class VideoAlreadyExistedHandler extends VideoSucceededHandler<EnsureVideoExistsAlreadyExistedEvent> {
  constructor(
    storeOutboxMessage: StoreOutboxMessage,
    entityProcessors: IngestEntityProcessor[],
    config: Config,
  ) {
    super(
      storeOutboxMessage,
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted,
      config,
    );
  }
}
