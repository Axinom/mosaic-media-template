import { LoginPgPool } from '@axinom/mosaic-db-common';
import { Broker } from '@axinom/mosaic-message-bus';
import {
  EnsureImageExistsAlreadyExistedEvent,
  ImageServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { IngestEntityProcessor } from '../models';
import { ImageSucceededHandler } from './image-succeeded-handler';

export class ImageAlreadyExistedHandler extends ImageSucceededHandler<EnsureImageExistsAlreadyExistedEvent> {
  constructor(
    entityProcessors: IngestEntityProcessor[],
    broker: Broker,
    loginPool: LoginPgPool,
    config: Config,
    overrides?: SubscriptionConfig,
  ) {
    super(
      entityProcessors,
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsAlreadyExisted
        .messageType,
      broker,
      loginPool,
      config,
      overrides,
    );
  }
}
