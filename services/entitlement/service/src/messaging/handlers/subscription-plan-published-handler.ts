import {
  SubscriptionMonetizationServiceMultiTenantMessagingSettings,
  SubscriptionPlanPublishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import { upsert } from 'zapatos/db';
import { Config } from '../../common';
import { EntitlementAuthenticatedTransactionalMessageHandler } from './entitlement-authenticated-message-handler';

export class SubscriptionPlanPublishedHandler extends EntitlementAuthenticatedTransactionalMessageHandler<SubscriptionPlanPublishedEvent> {
  constructor(config: Config) {
    super(
      SubscriptionMonetizationServiceMultiTenantMessagingSettings.SubscriptionPlanPublished,
      new Logger({
        config,
        context: SubscriptionPlanPublishedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    {
      payload: { id, title, description, claim_set_keys },
    }: TypedTransactionalMessage<SubscriptionPlanPublishedEvent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    await upsert(
      'subscription_plans',
      { id, title, description, claim_set_keys },
      ['id'],
    ).run(ownerClient);
  }
}
