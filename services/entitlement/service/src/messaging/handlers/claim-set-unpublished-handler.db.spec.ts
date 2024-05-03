import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { all, insert, select } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../tests/test-utils';
import { ClaimSetUnpublishedHandler } from './claim-set-unpublished-handler';

describe('ClaimSetUnpublishedHandler', () => {
  let ctx: ITestContext;
  let handler: ClaimSetUnpublishedHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ClaimSetUnpublishedHandler(ctx.ownerPool, ctx.config);
  });

  beforeEach(async () => {
    await insert('claim_sets', {
      key: 'BASIC',
      title: 'Basic',
      description: 'Desc 1',
      claims: ['ENTITY_TYPE_MOVIES'],
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('claim_sets');
    await ctx.truncate('subscription_plans');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  it('message for existing claim set received with existing unrelated subscription plan - claim set deleted', async () => {
    // Arrange
    await insert('subscription_plans', {
      id: '79320a3d-403d-46ea-83f4-1c8b5d4a3873',
      title: 'Premium Plan',
      description: 'Premium Plan ...',
      claim_set_keys: ['PREMIUM'],
    }).run(ctx.ownerPool);

    // Act
    await handler.onMessage({ key: 'BASIC' });

    // Assert
    const claimSets = await select('claim_sets', all).run(ctx.ownerPool);
    expect(claimSets).toEqual([]);
  });

  it('message for existing claim set received with existing related subscription plan - error thrown', async () => {
    // Arrange
    const content = { key: 'BASIC' };
    const subPlan = await insert('subscription_plans', {
      id: '79320a3d-403d-46ea-83f4-1c8b5d4a3873',
      title: 'Basic Plan',
      description: 'Basic Plan ...',
      claim_set_keys: [content.key],
    }).run(ctx.ownerPool);

    // Act
    const error = await rejectionOf(handler.onMessage(content));

    // Assert
    expect(error.message).toEqual(
      'Unable to unpublish the claim set, because it is used by 1 published subscription plan(s).',
    );
    expect(error.details).toEqual({
      content,
      relatedSubscriptionPlanIds: [subPlan.id],
    });

    const claimSets = await select('claim_sets', all, { columns: ['key'] }).run(
      ctx.ownerPool,
    );
    expect(claimSets).toEqual([content]);
  });
});
