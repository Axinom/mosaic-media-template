import { OwnerPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MessageInfo } from '@axinom/mosaic-message-bus';
import {
  SubscriptionMonetizationServiceMultiTenantMessagingSettings,
  SubscriptionPlanPublishedEvent,
} from '@axinom/mosaic-messages';
import { IsolationLevel, upsert } from 'zapatos/db';
import { Config } from '../../common';
import { EntitlementAuthenticatedMessageHandler } from './entitlement-authenticated-message-handler';

export class SubscriptionPlanPublishedHandler extends EntitlementAuthenticatedMessageHandler<SubscriptionPlanPublishedEvent> {
  constructor(private readonly ownerPool: OwnerPgPool, config: Config) {
    super(
      SubscriptionMonetizationServiceMultiTenantMessagingSettings
        .SubscriptionPlanPublished.messageType,
      config,
    );
  }

  async onMessage(
    content: SubscriptionPlanPublishedEvent,
    message: MessageInfo,
  ): Promise<void> {
    const { id, title, description, claim_set_keys } = content;
    await transactionWithContext(
      this.ownerPool,
      IsolationLevel.Serializable,
      this.getPgSettings(message),
      async (ctx) => {
        await upsert(
          'subscription_plans',
          { id, title, description, claim_set_keys },
          ['id'],
        ).run(ctx);
      },
    );
  }
}
