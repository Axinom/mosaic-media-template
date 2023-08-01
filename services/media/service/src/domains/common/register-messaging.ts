import { getLoginPgPool } from '@axinom/mosaic-db-common';
import { Broker, RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import {
  ImageServiceMultiTenantMessagingSettings,
  LocalizationServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Express } from 'express';
import {
  DeleteEntityCommand,
  MediaServiceMessagingSettings,
} from 'media-messages';
import { Config } from '../../common';
import {
  CuePointTypesDeclaredHandler,
  CuePointTypesDeclareFailedHandler,
  DeleteEntityCommandHandler,
  EntityDefinitionDeclareFailedHandler,
  EntityDefinitionDeclareFinishedHandler,
  EntityDefinitionDeleteFailedHandler,
  EntityDefinitionDeleteFinishedHandler,
} from './handlers';

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
      MediaServiceMessagingSettings.EntityDeleted,
      config,
    ).publishEvent(),

    // Video Cue Point types
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.DeclareCuePointTypes,
      config,
    ).sendCommand(),
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclared,
      config,
    ).subscribeForEvent(() => new CuePointTypesDeclaredHandler(config)),
    new RascalConfigBuilder(
      VideoServiceMultiTenantMessagingSettings.CuePointTypesDeclareFailed,
      config,
    ).subscribeForEvent(() => new CuePointTypesDeclareFailedHandler(config)),

    // Localization Entity Definition declaration
    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.DeclareEntityDefinition,
      config,
    ).sendCommand(),

    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFailed,
      config,
    ).subscribeForEvent(() => new EntityDefinitionDeclareFailedHandler(config)),

    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeclareFinished,
      config,
    ).subscribeForEvent(
      () => new EntityDefinitionDeclareFinishedHandler(config),
    ),

    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.DeleteEntityDefinition,
      config,
    ).sendCommand(),

    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFailed,
      config,
    ).subscribeForEvent(() => new EntityDefinitionDeleteFailedHandler(config)),

    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.EntityDefinitionDeleteFinished,
      config,
    ).subscribeForEvent(
      () => new EntityDefinitionDeleteFinishedHandler(config),
    ),

    // Localization sources sync
    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
      config,
    ).sendCommand(),
    new RascalConfigBuilder(
      LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
      config,
    ).sendCommand(),
  ];
};
