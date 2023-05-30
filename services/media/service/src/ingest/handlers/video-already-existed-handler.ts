import { LoginPgPool } from '@axinom/mosaic-db-common';
import { Broker } from '@axinom/mosaic-message-bus';
import {
  EnsureVideoExistsAlreadyExistedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';
export class VideoAlreadyExistedHandler extends VideoSucceededHandler<EnsureVideoExistsAlreadyExistedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    broker: Broker,
    loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted
        .messageType,
      broker,
      loginPool,
      config,
      overrides,
    );
  }
}
