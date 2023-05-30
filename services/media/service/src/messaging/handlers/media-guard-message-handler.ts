import { buildPgSettings } from '@axinom/mosaic-db-common';
import { GuardedMessageHandler } from '@axinom/mosaic-id-guard';
import { MessageInfo, OnMessageMiddleware } from '@axinom/mosaic-message-bus';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';
import { PermissionKey } from '../../domains/permission-definition';

/**
 * Guard a message handler by getting and verifying the JWT token. It changes
 * the `MessageInfo` parameter to `AuthenticatedMessageInfo` which contains the
 * JWT token subject.
 * In addition it checks that the subjects permission match the required ones.
 */
export abstract class MediaGuardedMessageHandler<
  TContent,
> extends GuardedMessageHandler<TContent> {
  constructor(
    messagingKey: string,
    permissions: PermissionKey[],
    protected readonly config: Config,
    overrides?: SubscriptionConfig,
    middleware: OnMessageMiddleware[] = [],
  ) {
    super(
      messagingKey,
      permissions,
      config.serviceId,
      {
        tenantId: config.tenantId,
        environmentId: config.environmentId,
        authEndpoint: config.idServiceAuthBaseUrl,
      },

      overrides,
      middleware,
    );
  }

  protected async getPgSettings(
    message: MessageInfo,
    dbRole?: string,
  ): Promise<{ [key: string]: string }> {
    return buildPgSettings(
      this.getSubject(message),
      dbRole ?? this.config.dbGqlRole,
      this.config.serviceId,
    );
  }
}
