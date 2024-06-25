import {
  buildAuthPgSettings,
  setPgSettingsConfig,
} from '@axinom/mosaic-db-common';
import {
  AuthenticatedManagementSubject,
  GuardedTransactionalInboxMessageHandler,
} from '@axinom/mosaic-id-guard';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { Logger } from '@axinom/mosaic-service-common';
import { ClientBase } from 'pg';
import { Config } from '../../common';
import { PermissionKey } from '../../domains';

export abstract class ChannelGuardedTransactionalInboxMessageHandler<
  T,
> extends GuardedTransactionalInboxMessageHandler<T, Config> {
  /**
   * Create a new Message handler which executes the business logic that for the
   * incoming transactional inbox message.
   * @param messagingSettings The messaging settings with the message and aggregate type
   * @param permissions The array of permissions that allow to execute this handler
   * @param logger The logger to use for this handler
   * @param config The service configuration object
   */
  constructor(
    messagingSettings: MessagingSettings,
    permissions: PermissionKey[],
    logger: Logger,
    config: Config,
  ) {
    super(
      messagingSettings,
      permissions,
      logger,
      config,
      config.idServiceAuthBaseUrl,
    );
  }

  protected override async setPgSettings(
    ownerClient: ClientBase,
    subject: AuthenticatedManagementSubject,
  ): Promise<void> {
    const pgSettings = buildAuthPgSettings(subject, this.config.serviceId);
    await setPgSettingsConfig(pgSettings, ownerClient);
  }
}
