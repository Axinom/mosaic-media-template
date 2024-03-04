import {
  AuthenticatedManagementSubject,
  AuthenticatedManagementSubjectMessageInfo,
} from '@axinom/mosaic-id-guard';
import { ClaimSetPublishedEvent } from '@axinom/mosaic-messages';
import { rejectionOf } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { all, insert, select } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { ClaimSetPublishedHandler } from './claim-set-published-handler';

describe('ClaimSetPublishedHandler', () => {
  let ctx: ITestContext;
  let handler: ClaimSetPublishedHandler;
  let user: AuthenticatedManagementSubject;
  let message: AuthenticatedManagementSubjectMessageInfo;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ClaimSetPublishedHandler(ctx.config);
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
    await ctx.truncate('claim_sets');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  it('new claim set received - claim set saved', async () => {
    // Arrange
    const message = {
      payload: {
        key: 'PREMIUM',
        title: 'Premium',
        claims: ['ENABLE_VIDEOS_DOWNLOAD'],
        custom_unsupported_property:
          'control case to make sure create/update works as expected even with updated message.',
      },
    } as unknown as TypedTransactionalMessage<ClaimSetPublishedEvent>;

    // Act
    await ctx.executeOwnerSql(user, async (dbCtx) =>
      handler.handleMessage(message, dbCtx),
    );

    // Assert
    const claimSets = await select('claim_sets', all).run(ctx.ownerPool);
    expect(claimSets).toMatchObject([
      {
        claims: ['ENABLE_VIDEOS_DOWNLOAD'],
        description: null,
        key: 'PREMIUM',
        title: 'Premium',
        updated_user: 'Monetization Admin',
        created_user: 'Monetization Admin',
      },
    ]);
    expect(claimSets[0].created_date).toBeTruthy();
    expect(claimSets[0].updated_date).toBeTruthy();
  });

  it('existing claim set received - claim set updated', async () => {
    // Arrange
    const created = await insert('claim_sets', {
      key: 'BASIC',
      title: 'Basic',
      description: 'Desc 1',
      claims: ['ENTITY_TYPE_MOVIES'],
    }).run(ctx.ownerPool);
    const message = {
      payload: {
        key: 'BASIC',
        title: 'Default',
        description: 'Desc 2',
        claims: ['ENTITY_TYPE_EPISODES'],
        custom_unsupported_property:
          'control case to make sure create/update works as expected even with updated message.',
      },
    } as unknown as TypedTransactionalMessage<ClaimSetPublishedEvent>;

    // Act
    await ctx.executeOwnerSql(user, async (dbCtx) =>
      handler.handleMessage(message, dbCtx),
    );

    // Assert
    const claimSets = await select('claim_sets', all).run(ctx.ownerPool);
    expect(claimSets).toMatchObject([
      {
        claims: ['ENTITY_TYPE_EPISODES'],
        description: 'Desc 2',
        key: 'BASIC',
        title: 'Default',
        updated_user: 'Monetization Admin',
        created_user: 'Unknown',
        created_date: created.created_date,
      },
    ]);
    expect(claimSets[0].updated_date).toBeTruthy();
  });

  it('claim set with invalid claim - error thrown', async () => {
    // Arrange
    const message = {
      payload: {
        key: 'PREMIUM',
        title: 'Premium',
        claims: [
          'ENTITY_TYPE_MOVIES',
          'ENTITY_TYPE_EPISODES',
          'TEST_VALUE',
          'ENABLE_VIDEOS_DOWNLOAD',
        ],
      },
    } as unknown as TypedTransactionalMessage<ClaimSetPublishedEvent>;

    // Act
    const error = await ctx.executeOwnerSql(user, async (dbCtx) => {
      return rejectionOf(handler.handleMessage(message, dbCtx));
    });

    // Assert
    expect(error.message).toEqual(
      'Unable to create or update claims set, because it contains invalid claims.',
    );
    expect(error.details).toEqual({
      payload: message.payload,
      invalidClaims: ['TEST_VALUE'],
    });

    const claimSets = await select('claim_sets', all).run(ctx.ownerPool);
    expect(claimSets).toEqual([]);
  });
});
