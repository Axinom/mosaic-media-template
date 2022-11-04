import { getLoginPgPool } from '@axinom/mosaic-db-common';
import { Broker, RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { Express } from 'express';
import {
  MediaServiceMessagingSettings,
  PublishEntityCommand,
  PublishServiceMessagingSettings,
  UnpublishEntityCommand,
} from 'media-messages';
import { Config } from '../common';
import {
  PublishEntityCommandHandler,
  UnpublishEntityCommandHandler,
} from './handlers';
import { EntityPublishingProcessor } from './models';

export const registerPublishingMessaging = (
  entityPublishEventSettings: PublishServiceMessagingSettings[],
  publishingProcessors: EntityPublishingProcessor[],
  app: Express,
  config: Config,
): RascalConfigBuilder[] => {
  const loginPool = getLoginPgPool(app);
  return [
    new RascalConfigBuilder(MediaServiceMessagingSettings.PublishEntity, config)
      .sendCommand()
      .subscribeForCommand<PublishEntityCommand>(
        (broker: Broker) =>
          new PublishEntityCommandHandler(
            publishingProcessors,
            broker,
            loginPool,
            config,
          ),
      ),
    new RascalConfigBuilder(
      MediaServiceMessagingSettings.UnpublishEntity,
      config,
    )
      .sendCommand()
      .subscribeForCommand<UnpublishEntityCommand>(
        (broker: Broker) =>
          new UnpublishEntityCommandHandler(
            publishingProcessors,
            broker,
            loginPool,
            config,
          ),
      ),
    ...entityPublishEventSettings.map((settings) =>
      new RascalConfigBuilder(settings, config).publishEvent(),
    ),
  ];
};
