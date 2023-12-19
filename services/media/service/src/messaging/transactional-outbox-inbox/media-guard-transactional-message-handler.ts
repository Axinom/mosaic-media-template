import {
  buildAuthPgSettings,
  setPgSettingsConfig,
} from '@axinom/mosaic-db-common';
import {
  AuthenticatedManagementSubject,
  GuardedConfig,
  GuardedTransactionalInboxMessageHandler,
} from '@axinom/mosaic-id-guard';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { ClientBase } from 'pg';
import { PermissionKey } from '../../domains/permission-definition';

export type MediaGuardedConfig = GuardedConfig & {
  tenantId: string;
  environmentId: string;
};

export abstract class MediaGuardedTransactionalInboxMessageHandler<
  T,
  TConfig extends MediaGuardedConfig,
> extends GuardedTransactionalInboxMessageHandler<T, TConfig> {
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
    config: TConfig,
  ) {
    super(messagingSettings, permissions, logger, config, {
      tenantId: config.tenantId,
      environmentId: config.environmentId,
      authEndpoint: config.idServiceAuthBaseUrl,
    });
  }

  protected override async setPgSettings(
    ownerClient: ClientBase,
    subject: AuthenticatedManagementSubject,
  ): Promise<void> {
    const pgSettings = buildAuthPgSettings(subject, this.config.serviceId);
    await setPgSettingsConfig(pgSettings, ownerClient);
  }

  override mapError(error: Error): Error {
    return getMappedError(error);
  }
}
