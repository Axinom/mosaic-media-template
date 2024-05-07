import { OwnerPgPool } from '@axinom/mosaic-db-common';
import {
  ClaimSetUnpublishedEvent,
  MonetizationGrantsServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import { deletes, param, select, self as value, SQL, sql } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { EntitlementAuthenticatedMessageHandler } from './entitlement-authenticated-message-handler';

export class ClaimSetUnpublishedHandler extends EntitlementAuthenticatedMessageHandler<ClaimSetUnpublishedEvent> {
  constructor(private readonly ownerPool: OwnerPgPool, config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings.ClaimSetUnpublished
        .messageType,
      config,
    );
  }

  async onMessage(content: ClaimSetUnpublishedEvent): Promise<void> {
    const relatedSubPlans = await select('subscription_plans', {
      claim_set_keys: sql<SQL>`${param(content.key)} = ANY(${value})`,
    }).run(this.ownerPool);
    if (relatedSubPlans.length > 0) {
      throw new MosaicError({
        ...CommonErrors.ClaimSetUnpublishError,
        details: {
          relatedSubscriptionPlanIds: relatedSubPlans.map((sp) => sp.id),
          content,
        },
        messageParams: [relatedSubPlans.length],
      });
    }

    await deletes('claim_sets', content).run(this.ownerPool);
  }
}
