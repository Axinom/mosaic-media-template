import { LoginPgPool } from '@axinom/mosaic-db-common';
import { Broker } from '@axinom/mosaic-message-bus';
import {
  EnsureVideoExistsCreationStartedEvent,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { VideoSucceededHandler } from './video-succeeded-handler';

export class VideoCreationStartedHandler extends VideoSucceededHandler<EnsureVideoExistsCreationStartedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    broker: Broker,
    loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      entityProcessors,
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsCreationStarted
        .messageType,
      broker,
      loginPool,
      config,
      overrides,
    );
  }
}
