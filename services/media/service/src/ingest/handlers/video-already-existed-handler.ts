import {
  EnsureVideoExistsAlreadyExistedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';
export class VideoAlreadyExistedHandler extends VideoSucceededHandler<EnsureVideoExistsAlreadyExistedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    super(
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted,
      storeOutboxMessage,
      config,
    );
  }
}
