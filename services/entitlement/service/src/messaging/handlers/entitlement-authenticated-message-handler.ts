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
import { Config } from '../../common';

/**
 * Custom channel message handler to verify channel permissions
 */
export abstract class EntitlementAuthenticatedTransactionalMessageHandler<
  T,
> extends TransactionalInboxMessageHandler<T, Config> {
  constructor(
    messagingSettings: MessagingSettings,
    logger: Logger,
    messageProducerService:
      | 'ax-monetization-grants-service'
      | 'ax-subscription-monetization-service',
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

      // Check that the message producer had permissions on that service
      const subjectPermissions = subject.permissions?.[messageProducerService];
      if (
        subjectPermissions === undefined ||
        !Array.isArray(subjectPermissions)
      ) {
        throw new MosaicError({
          code: IdGuardErrors.Unauthorized.code,
          message: `Permission check failed as the subject has no permissions for the Channel Service.`,
        });
      }

      const pgSettings = buildAuthPgSettings(subject, messageProducerService);
      await setPgSettingsConfig(pgSettings, dbClient);
      return { subject };
    };
    super(messagingSettings, logger, config, authWrapper);
  }
}
