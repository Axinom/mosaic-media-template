import {
  AuthenticatedManagementSubject,
  authenticationMiddleware,
  getMessageInfoManagementSubject,
} from '@axinom/mosaic-id-guard';
import {
  MessageHandler,
  MessageInfo,
  OnMessageMiddleware,
} from '@axinom/mosaic-message-bus';
import { SubscriptionConfig } from 'rascal';
import { Config } from '../../common';

/**
 * Guard a message handler by getting and verifying the JWT token. It changes
 * the `MessageInfo` parameter to `AuthenticatedMessageInfo` which contains the
 * JWT token subject.
 */
export abstract class AuthenticatedMessageHandler<
  TContent,
> extends MessageHandler<TContent> {
  constructor(
    messagingKey: string,
    protected readonly config: Config,
    overrides?: SubscriptionConfig,
    middleware: OnMessageMiddleware[] = [],
  ) {
    super(messagingKey, overrides, [
      ...middleware,
      authenticationMiddleware({
        tenantId: config.tenantId,
        environmentId: config.environmentId,
        authEndpoint: config.idServiceAuthBaseUrl,
      }),
    ]);
  }
  protected getSubject(message: MessageInfo): AuthenticatedManagementSubject {
    return getMessageInfoManagementSubject(message);
  }
}
