import { OwnerPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageInfo } from '@axinom/mosaic-message-bus';
import {
  ClaimSetPublishedEvent,
  MonetizationGrantsServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { difference, MosaicError } from '@axinom/mosaic-service-common';
import { IsolationLevel, upsert } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { validClaims } from '../../domains';
import { EntitlementAuthenticatedMessageHandler } from './entitlement-authenticated-message-handler';

export class ClaimSetPublishedHandler extends EntitlementAuthenticatedMessageHandler<ClaimSetPublishedEvent> {
  constructor(private readonly ownerPool: OwnerPgPool, config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings.ClaimSetPublished
        .messageType,
      config,
    );
  }

  async onMessage(
    content: ClaimSetPublishedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const invalidClaims = difference(content.claims, validClaims);
    if (invalidClaims.length > 0) {
      throw new MosaicError({
        ...CommonErrors.InvalidClaimsInClaimSet,
        details: { invalidClaims, content },
      });
    }

    const { key, title, description, claims } = content;
    await transactionWithContext(
      this.ownerPool,
      IsolationLevel.Serializable,
      this.getPgSettings(message),
      async (ctx) => {
        await upsert('claim_sets', { key, title, description, claims }, [
          'key',
        ]).run(ctx);
      },
    );
  }
}
