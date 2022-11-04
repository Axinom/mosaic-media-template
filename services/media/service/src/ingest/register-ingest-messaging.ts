import { getLoginPgPool } from '@axinom/mosaic-db-common';
import { Broker, RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import {
  EnsureImageExistsAlreadyExistedEvent,
  EnsureImageExistsFailedEvent,
  EnsureImageExistsImageCreatedEvent,
  EnsureVideoExistsAlreadyExistedEvent,
  EnsureVideoExistsCreationStartedEvent,
  EnsureVideoExistsFailedEvent,
  ImageServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Express } from 'express';
import {
  CheckFinishIngestDocumentCommand,
  CheckFinishIngestItemCommand,
  MediaServiceMessagingSettings,
  StartIngestCommand,
  StartIngestItemCommand,
  UpdateMetadataCommand,
} from 'media-messages';
import { Config } from '../common';
import {
  CheckFinishIngestDocumentHandler,
  CheckFinishIngestItemHandler,
  ImageAlreadyExistedHandler,
  ImageCreatedHandler,
  ImageFailedHandler,
  StartIngestHandler,
  StartIngestItemHandler,
  UpdateMetadataHandler,
  VideoAlreadyExistedHandler,
  VideoCreationStartedHandler,
  VideoFailedHandler,
} from './handlers';
import { IngestEntityProcessor } from './models';

export const registerIngestMessaging = (
  entityProcessors: IngestEntityProcessor[],
  app: Express,
  config: Config,
): RascalConfigBuilder[] => {
  const loginPool = getLoginPgPool(app);
  return [
    new RascalConfigBuilder(MediaServiceMessagingSettings.StartIngest, config)
      .sendCommand()
      .subscribeForCommand<StartIngestCommand>(
        (broker: Broker) =>
          new StartIngestHandler(entityProcessors, broker, loginPool, config),
      ),
    new RascalConfigBuilder(
      MediaServiceMessagingSettings.StartIngestItem,
      config,
    )
      .sendCommand()
      .subscribeForCommand<StartIngestItemCommand>(
        (broker: Broker) =>
          new StartIngestItemHandler(
            entityProcessors,
            broker,
            loginPool,
            config,
          ),
      ),
    new RascalConfigBuilder(
      MediaServiceMessagingSettings.UpdateMetadata,
      config,
    )
      .sendCommand()
      .subscribeForCommand<UpdateMetadataCommand>(
        (broker: Broker) =>
          new UpdateMetadataHandler(
            entityProcessors,
            broker,
            loginPool,
            config,
          ),
      ),
    new RascalConfigBuilder(
      MediaServiceMessagingSettings.CheckFinishIngestItem,
      config,
    )
      .sendCommand()
      .subscribeForCommand<CheckFinishIngestItemCommand>(
        () => new CheckFinishIngestItemHandler(loginPool, config),
      ),
    new RascalConfigBuilder(
      MediaServiceMessagingSettings.CheckFinishIngestDocument,
      config,
    )
      .sendCommand()
      .subscribeForCommand<CheckFinishIngestDocumentCommand>(
        (broker: Broker) =>
          new CheckFinishIngestDocumentHandler(loginPool, broker, config),
      ),
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
      config,
    ).sendCommand(),
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsAlreadyExisted,
      config,
    ).subscribeForEvent<EnsureVideoExistsAlreadyExistedEvent>(
      (broker: Broker) =>
        new VideoAlreadyExistedHandler(
          entityProcessors,
          broker,
          loginPool,
          config,
        ),
    ),
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsCreationStarted,
      config,
    ).subscribeForEvent<EnsureVideoExistsCreationStartedEvent>(
      (broker: Broker) =>
        new VideoCreationStartedHandler(
          entityProcessors,
          broker,
          loginPool,
          config,
        ),
    ),
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExistsFailed,
      config,
    ).subscribeForEvent<EnsureVideoExistsFailedEvent>(
      (broker: Broker) => new VideoFailedHandler(broker, config),
    ),
    new RascalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExists,
      config,
    ).sendCommand(),
    new RascalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsAlreadyExisted,
      config,
    ).subscribeForEvent<EnsureImageExistsAlreadyExistedEvent>(
      (broker: Broker) =>
        new ImageAlreadyExistedHandler(
          entityProcessors,
          broker,
          loginPool,
          config,
        ),
    ),
    new RascalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsImageCreated,
      config,
    ).subscribeForEvent<EnsureImageExistsImageCreatedEvent>(
      (broker: Broker) =>
        new ImageCreatedHandler(entityProcessors, broker, loginPool, config),
    ),
    new RascalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.EnsureImageExistsFailed,
      config,
    ).subscribeForEvent<EnsureImageExistsFailedEvent>(
      (broker: Broker) => new ImageFailedHandler(broker, config),
    ),
  ];
};
