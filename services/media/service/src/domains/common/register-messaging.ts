import { getLoginPgPool } from '@axinom/mosaic-db-common';
import { Broker, RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import {
  ImageServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Express } from 'express';
import {
  DeleteEntityCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../common';
import { DeleteEntityCommandHandler } from './handlers';

export const registerCommonMessaging = (
  app: Express,
  config: Config,
): RascalConfigBuilder[] => {
  const loginPool = getLoginPgPool(app);
  return [
    new RascalConfigBuilder(MediaServiceMessagingSettings.DeleteEntity, config)
      .sendCommand()
      .subscribeForCommand<DeleteEntityCommand>(
        (broker: Broker) =>
          new DeleteEntityCommandHandler(broker, loginPool, config),
      ),
    new RascalConfigBuilder(
      ImageServiceMultiTenantMessagingSettings.DeclareImageTypes,
      config,
    ).sendCommand(),
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes,
      config,
    ).sendCommand(),
    new RascalConfigBuilder(
      MediaServiceMessagingSettings.EntityDeleted,
      config,
    ).publishEvent(),
  ];
};
