import {
  ClaimSetUnpublishedEvent,
  MonetizationGrantsServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { deletes, param, select, self as value, SQL, sql } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { EntitlementAuthenticatedTransactionalMessageHandler } from './entitlement-authenticated-message-handler';

export class ClaimSetUnpublishedHandler extends EntitlementAuthenticatedTransactionalMessageHandler<ClaimSetUnpublishedEvent> {
  constructor(config: Config) {
    super(
      MonetizationGrantsServiceMultiTenantMessagingSettings.ClaimSetUnpublished,
      new Logger({
        config,
        context: ClaimSetUnpublishedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<ClaimSetUnpublishedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    const relatedSubPlans = await select('subscription_plans', {
      claim_set_keys: sql<SQL>`${param(payload.key)} = ANY(${value})`,
    }).run(ownerClient);
    if (relatedSubPlans.length > 0) {
      throw new MosaicError({
        ...CommonErrors.ClaimSetUnpublishError,
        details: {
          relatedSubscriptionPlanIds: relatedSubPlans.map((sp) => sp.id),
          payload,
        },
        messageParams: [relatedSubPlans.length],
      });
    }

    await deletes('claim_sets', payload).run(ownerClient);
  }
}
