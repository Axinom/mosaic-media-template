import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  PeriodUnit,
  SubscriptionPlanPublishedEvent,
} from '@axinom/mosaic-messages';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import { all, insert, select } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { SubscriptionPlanPublishedHandler } from './subscription-plan-published-handler';

describe('SubscriptionPlanPublishedHandler', () => {
  let ctx: ITestContext;
  let handler: SubscriptionPlanPublishedHandler;
  let user: AuthenticatedManagementSubject;
  const message = {
    payload: {
      id: '79320a3d-403d-46ea-83f4-1c8b5d4a3873',
      title: 'PREMIUM_PLAN',
      description: 'Premium SubPlan',
      is_active: true,
      claim_set_keys: ['PREMIUM'],
      provider_configs: [{ payment_provider_key: 'PAYPAL' }],
      payment_plans: [
        {
          id: '62a4b0fd-7873-4964-be72-0521f328ad95',
          title: 'Random Payment Plan',
          description: 'Some description',
          is_active: true,
          period_unit: 'YEAR' as PeriodUnit,
          period_quantity: 10,
          provider_configs: [{ payment_provider_key: 'PAYPAL' }],
          prices: [{ country: 'XX', currency: 'XXX', price: 123 }],
        },
      ],
      custom_unsupported_property:
        'control case to make sure create/update works as expected even with updated message.',
    },
  } as unknown as TypedTransactionalMessage<SubscriptionPlanPublishedEvent>;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new SubscriptionPlanPublishedHandler(ctx.config);
    user = createTestUser({ name: 'Monetization Admin' });
  });

  afterEach(async () => {
    await ctx.truncate('subscription_plans');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  it('new subscription plan received - subscription plan saved', async () => {
    // Act
    await ctx.executeOwnerSql(user, async (dbCtx) =>
      handler.handleMessage(message, dbCtx),
    );

    // Assert
    const subscriptionPlans = await select('subscription_plans', all).run(
      ctx.ownerPool,
    );
    const { id, title, description, claim_set_keys } = message.payload;
    expect(subscriptionPlans).toMatchObject([
      {
        id,
        title,
        description,
        claim_set_keys,
        created_user: 'Monetization Admin',
        updated_user: 'Monetization Admin',
      },
    ]);
    expect(subscriptionPlans[0].created_date).toBeTruthy();
    expect(subscriptionPlans[0].updated_date).toBeTruthy();
  });

  it('existing subscription plan received - subscription plan updated', async () => {
    // Arrange
    const created = await insert('subscription_plans', {
      id: message.payload.id,
      title: 'Basic Plan',
      description: 'Basic Plan ...',
      claim_set_keys: ['BASIC'],
    }).run(ctx.ownerPool);

    // Act
    await ctx.executeOwnerSql(user, async (dbCtx) =>
      handler.handleMessage(message, dbCtx),
    );

    // Assert
    const subscriptionPlans = await select('subscription_plans', all).run(
      ctx.ownerPool,
    );
    const { id, title, description, claim_set_keys } = message.payload;
    expect(subscriptionPlans).toMatchObject([
      {
        id,
        title,
        description,
        claim_set_keys,
        updated_user: 'Monetization Admin',
        created_user: 'Unknown',
        created_date: created.created_date,
      },
    ]);
    expect(subscriptionPlans[0].updated_date).toBeTruthy();
  });
});
