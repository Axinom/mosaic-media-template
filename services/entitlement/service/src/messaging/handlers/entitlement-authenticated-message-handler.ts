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
import {
  Logger,
  MosaicError,
  MosaicErrors,
} from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { DatabaseClient } from 'pg-transactional-outbox';
import { Config } from '../../common';

/**
 * Abstract message handler to verify permissions of the message producing service
 */
export abstract class EntitlementAuthenticatedTransactionalMessageHandler<
  T,
> extends TransactionalInboxMessageHandler<T, Config> {
  constructor(
    messagingSettings: MessagingSettings,
    logger: Logger,
    config: Config,
  ) {
    const messageProducerServiceId = messagingSettings.serviceId;
    if (!messageProducerServiceId) {
      throw new MosaicError({
        message:
          'The service ID was not provided for the EntitlementAuthenticatedTransactionalMessageHandler messaging settings.',
        code: MosaicErrors.AssertionFailed.code,
      });
    }

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
      const subjectPermissions =
        subject.permissions?.[messageProducerServiceId];
      if (
        subjectPermissions === undefined ||
        !Array.isArray(subjectPermissions)
      ) {
        throw new MosaicError({
          code: IdGuardErrors.Unauthorized.code,
          message: `Permission check failed as the subject has no permissions for the ${messageProducerServiceId} service.`,
        });
      }
      const pgSettings = buildAuthPgSettings(subject, messageProducerServiceId);
      await setPgSettingsConfig(pgSettings, dbClient);
      return { subject };
    };

    super(messagingSettings, logger, config, authWrapper);
  }
}
