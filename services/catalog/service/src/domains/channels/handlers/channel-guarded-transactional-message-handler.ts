import {
  buildAuthPgSettings,
  setPgSettingsConfig,
} from '@axinom/mosaic-db-common';
import {
  getAuthenticatedManagementSubject,
  GuardedContext,
  IdGuardErrors,
} from '@axinom/mosaic-id-guard';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { DatabaseClient } from 'pg-transactional-outbox';
import { Config } from '../../../common';

const channelServiceId = 'ax-channel-service';

/**
 * Custom channel message handler to verify channel permissions
 */
export abstract class ChannelGuardedTransactionalMessageHandler<
  T,
> extends TransactionalInboxMessageHandler<T, Config> {
  constructor(
    messagingSettings: MessagingSettings,
    logger: Logger,
    config: Config,
  ) {
    const authWrapper = async <TMessage>(
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

      const subjectPermissions = subject.permissions?.[channelServiceId];
      if (
        subjectPermissions === undefined ||
        !Array.isArray(subjectPermissions)
      ) {
        throw new MosaicError({
          code: IdGuardErrors.Unauthorized.code,
          message: `Permission check failed as the subject has no permissions for the Channel Service.`,
        });
      }

      const pgSettings = buildAuthPgSettings(subject, channelServiceId);
      await setPgSettingsConfig(pgSettings, dbClient);
      return { subject };
    };
    super(messagingSettings, logger, config, authWrapper);
  }
}
