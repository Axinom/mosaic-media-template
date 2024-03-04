import {
  ClaimSetPublishedEvent,
  MonetizationGrantsServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { difference, Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { upsert } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { validClaims } from '../../domains';
import { EntitlementAuthenticatedTransactionalMessageHandler } from './entitlement-authenticated-message-handler';

export class ClaimSetPublishedHandler extends EntitlementAuthenticatedTransactionalMessageHandler<ClaimSetPublishedEvent> {
  constructor(config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings.ClaimSetPublished,
      new Logger({
        config,
        context: ClaimSetPublishedHandler.name,
      }),
      'ax-monetization-grants-service',
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<ClaimSetPublishedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const invalidClaims = difference(payload.claims, validClaims);
    if (invalidClaims.length > 0) {
      throw new MosaicError({
        ...CommonErrors.InvalidClaimsInClaimSet,
        details: { invalidClaims, payload },
      });
    }

    const { key, title, description, claims } = payload;
    await upsert('claim_sets', { key, title, description, claims }, [
      'key',
    ]).run(ownerClient);
  }
}
