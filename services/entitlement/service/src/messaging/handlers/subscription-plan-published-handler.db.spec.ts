import {
  AuthenticatedManagementSubject,
  AuthenticatedManagementSubjectMessageInfo,
} from '@axinom/mosaic-id-guard';
import { PeriodUnit } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
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
  let message: AuthenticatedManagementSubjectMessageInfo;
  const content = {
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
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new SubscriptionPlanPublishedHandler(ctx.ownerPool, ctx.config);
    user = createTestUser({ name: 'Monetization Admin' });
    message = stub<AuthenticatedManagementSubjectMessageInfo>({
      envelope: {
        auth_token:
          'some token value which is not used because we are substituting getSubject method and using a stub user',
      },
      subject: user,
    });
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
    await handler.onMessage(content, message);

    // Assert
    const subscriptionPlans = await select('subscription_plans', all).run(
      ctx.ownerPool,
    );
    const { id, title, description, claim_set_keys } = content;
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
      id: content.id,
      title: 'Basic Plan',
      description: 'Basic Plan ...',
      claim_set_keys: ['BASIC'],
    }).run(ctx.ownerPool);

    // Act
    await handler.onMessage(content, message);

    // Assert
    const subscriptionPlans = await select('subscription_plans', all).run(
      ctx.ownerPool,
    );
    const { id, title, description, claim_set_keys } = content;
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
