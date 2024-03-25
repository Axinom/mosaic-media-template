import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { ClaimSetUnpublishedEvent } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import { all, insert, select } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { ClaimSetUnpublishedHandler } from './claim-set-unpublished-handler';

describe('ClaimSetUnpublishedHandler', () => {
  let ctx: ITestContext;
  let handler: ClaimSetUnpublishedHandler;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ClaimSetUnpublishedHandler(ctx.config);
    user = createTestUser({ name: 'Monetization Admin' });
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
    const message = {
      payload: { key: 'BASIC' },
    } as unknown as TypedTransactionalMessage<ClaimSetUnpublishedEvent>;

    // Act
    await ctx.executeOwnerSql(user, async (dbCtx) =>
      handler.handleMessage(message, dbCtx),
    );

    // Assert
    const claimSets = await select('claim_sets', all).run(ctx.ownerPool);
    expect(claimSets).toEqual([]);
  });

  it('message for existing claim set received with existing related subscription plan - error thrown', async () => {
    // Arrange
    const payload = { key: 'BASIC' };
    const subPlan = await insert('subscription_plans', {
      id: '79320a3d-403d-46ea-83f4-1c8b5d4a3873',
      title: 'Basic Plan',
      description: 'Basic Plan ...',
      claim_set_keys: [payload.key],
    }).run(ctx.ownerPool);
    const message = {
      payload,
    } as unknown as TypedTransactionalMessage<ClaimSetUnpublishedEvent>;

    // Act
    const error = await ctx.executeOwnerSql(user, async (dbCtx) => {
      return rejectionOf(handler.handleMessage(message, dbCtx));
    });

    // Assert
    expect(error.message).toEqual(
      'Unable to unpublish the claim set, because it is used by 1 published subscription plan(s).',
    );
    expect(error.details).toEqual({
      payload,
      relatedSubscriptionPlanIds: [subPlan.id],
    });

    const claimSets = await select('claim_sets', all, { columns: ['key'] }).run(
      ctx.ownerPool,
    );
    expect(claimSets).toEqual([payload]);
  });
});
