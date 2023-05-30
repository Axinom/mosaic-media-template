import { LoginPgPool } from '@axinom/mosaic-db-common';
import { Broker } from '@axinom/mosaic-message-bus';
import {
  EnsureImageExistsImageCreatedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { ImageSucceededHandler } from './image-succeeded-handler';

export class ImageCreatedHandler extends ImageSucceededHandler<EnsureImageExistsImageCreatedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    broker: Broker,
    loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      entityProcessors,
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsImageCreated
        .messageType,
      broker,
      loginPool,
      config,
      overrides,
    );
  }
}
