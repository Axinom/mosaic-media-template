import {
  buildAuthPgSettings,
  setPgSettingsConfig,
} from '@axinom/mosaic-db-common';
import {
  AuthenticatedManagementSubject,
  getAuthenticatedManagementSubject,
  GuardedConfig,
  GuardedContext,
  GuardedTransactionalInboxMessageHandler,
  IdGuardErrors,
  permissionsCheck,
} from '@axinom/mosaic-id-guard';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { DatabaseClient } from 'pg-transactional-outbox';
import { Config } from '../../../common';

export type MediaGuardedConfig = GuardedConfig & {
  tenantId: string;
  environmentId: string;
};

const channelPublishPermissions = ['ADMIN', 'CHANNELS_EDIT'];
const channelServiceId = 'ax-channel-service';

/**
 * Custom channel message handler to verify channel permissions
 */
export abstract class ChannelGuardedTransactionalMessageHandler<
  T,
> extends GuardedTransactionalInboxMessageHandler<T, Config> {
  constructor(
    messagingSettings: MessagingSettings,
    logger: Logger,
    config: Config,
  ) {
    super(messagingSettings, channelPublishPermissions, logger, config, {
      tenantId: config.tenantId,
      environmentId: config.environmentId,
      authEndpoint: config.idServiceAuthBaseUrl,
    });
  }

  /**
   * Override the authentication to check the permissions from the Channel Service
   */
  protected override authenticateAndAuthorize = async <TMessage>(
    message: TypedTransactionalMessage<TMessage>,
    dbClient: DatabaseClient,
  ): Promise<GuardedContext> => {
    const token = message.metadata.authToken;
    if (token === undefined) {
      throw new MosaicError(IdGuardErrors.AccessTokenRequired);
    }
    const subject = await getAuthenticatedManagementSubject(token, {
      tenantId: this.config.tenantId,
      environmentId: this.config.environmentId,
      authEndpoint: this.config.idServiceAuthBaseUrl,
    });
    await permissionsCheck(subject, this.permissions, channelServiceId);
    this.setPgSettings(dbClient, subject);
    return { subject };
  };

  protected override async setPgSettings(
    ownerClient: DatabaseClient,
    subject: AuthenticatedManagementSubject,
  ): Promise<void> {
    const pgSettings = buildAuthPgSettings(subject, channelServiceId);
    await setPgSettingsConfig(pgSettings, ownerClient);
  }
}
