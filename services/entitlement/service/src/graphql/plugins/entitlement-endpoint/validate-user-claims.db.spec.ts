import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import { insert, update } from 'zapatos/db';
import { CommonErrors } from '../../../common';
import {
  COUNTRY_CLAIM_PREFIX,
  ENABLE_VIDEOS_DOWNLOAD,
  ENTITY_TYPE_CHANNELS,
  ENTITY_TYPE_EPISODES,
  ENTITY_TYPE_MOVIES,
  QUALITY_HD,
  QUALITY_SD,
  QUALITY_UHD1,
  QUALITY_UHD2,
} from '../../../domains';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { EntityWithVideoType } from './catalog-service-communication';
import { validateUserClaims } from './validate-user-claims';

describe('validateUserClaims', () => {
  let ctx: ITestContext;
  const subscriptionPlanId = 'fadf7cc2-f84c-42ac-8de1-7884b08873b2';
  const claimSetKey = 'TEST';

  beforeAll(async () => {
    ctx = await createTestContext({ MOSAIC_TESTING_IP_ENABLED: 'false' });

    await insert('subscription_plans', {
      id: subscriptionPlanId,
      title: 'Test Plan',
      claim_set_keys: [claimSetKey],
    }).run(ctx.ownerPool);
  });

  beforeEach(async () => {
    await insert('claim_sets', {
      key: claimSetKey,
      title: 'test',
      claims: [],
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('claim_sets');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.truncate('subscription_plans');
    await ctx.dispose();
  });

  describe('Error cases', () => {
    it('Subscription Plan does not exist', async () => {
      // Act
      const error = await rejectionOf(
        validateUserClaims(
          'fadf7cc2-0000-0000-0000-7884b08873b2',
          'movie',
          'NL',
          false,
          ctx.ownerPool,
        ),
      );

      // Assert
      expect(error.message).toEqual(
        'Subscription Plan not found. Please re-publish claim sets and subscription plans or contact the service support.',
      );
      expect(error.code).toEqual(CommonErrors.SubscriptionValidationError.code);
    });

    it.each(['movie', 'episode', 'channel'])(
      'Subscription Plan without claims for %p',
      async (type) => {
        // Act
        const error = await rejectionOf(
          validateUserClaims(
            subscriptionPlanId,
            type as EntityWithVideoType,
            'NL',
            false,
            ctx.ownerPool,
          ),
        );

        // Assert
        expect(error.message).toEqual(
          `The users subscription does not allow playback of ${type}s as it does not define any claims.`,
        );
        expect(error.code).toEqual(
          CommonErrors.SubscriptionValidationError.code,
        );
      },
    );

    it.each([
      [ENTITY_TYPE_EPISODES, 'movie'],
      [ENTITY_TYPE_CHANNELS, 'episode'],
      [ENTITY_TYPE_MOVIES, 'channel'],
    ])(
      'Subscription Plan with a mismatched entity claim for %p',
      async (claim, type) => {
        // Arrange
        await update(
          'claim_sets',
          { claims: [claim] },
          { key: claimSetKey },
        ).run(ctx.ownerPool);

        // Act
        const error = await rejectionOf(
          validateUserClaims(
            subscriptionPlanId,
            type as EntityWithVideoType,
            'NL',
            false,
            ctx.ownerPool,
          ),
        );

        // Assert
        expect(error.message).toEqual(
          `Users subscription does not allow playback of ${type}s.`,
        );
        expect(error.code).toEqual(
          CommonErrors.SubscriptionValidationError.code,
        );
      },
    );

    it('Persistence requested, but claim for it not set', async () => {
      // Arrange
      await update(
        'claim_sets',
        { claims: [ENTITY_TYPE_MOVIES] },
        { key: claimSetKey },
      ).run(ctx.ownerPool);

      // Act
      const error = await rejectionOf(
        validateUserClaims(
          subscriptionPlanId,
          'movie',
          'NL',
          true,
          ctx.ownerPool,
        ),
      );

      // Assert
      expect(error.message).toEqual(
        'License persistence was requested, but Enable Videos Download claim was not found.',
      );
      expect(error.code).toEqual(CommonErrors.SubscriptionValidationError.code);
    });

    it('Country claims included that do not match current country', async () => {
      // Arrange
      await update(
        'claim_sets',
        {
          claims: [
            ENTITY_TYPE_MOVIES,
            `${COUNTRY_CLAIM_PREFIX}US`,
            `${COUNTRY_CLAIM_PREFIX}EE`,
            `${COUNTRY_CLAIM_PREFIX}DE`,
          ],
        },
        { key: claimSetKey },
      ).run(ctx.ownerPool);

      // Act
      const error = await rejectionOf(
        validateUserClaims(
          subscriptionPlanId,
          'movie',
          'NL',
          false,
          ctx.ownerPool,
        ),
      );

      // Assert
      expect(error.message).toEqual(
        'Playback is not allowed in your current country (NL).',
      );
      expect(error.code).toEqual(CommonErrors.SubscriptionValidationError.code);
    });
  });

  describe('Success cases', () => {
    it.each([
      ['movie', ENTITY_TYPE_MOVIES],
      ['episode', ENTITY_TYPE_EPISODES],
      ['channel', ENTITY_TYPE_CHANNELS],
    ])(
      'Just %p entity type claim is enough for validation to pass without persistence or countries',
      async (type, claim) => {
        // Arrange
        await update(
          'claim_sets',
          { claims: [claim] },
          { key: claimSetKey },
        ).run(ctx.ownerPool);

        // Act
        const claims = await validateUserClaims(
          subscriptionPlanId,
          type as EntityWithVideoType,
          'NL',
          false,
          ctx.ownerPool,
        );

        // Assert
        // Quality and Country claims are not returned here, because no claim
        // sets have them assigned.
        expect(claims).toEqual([claim]);
      },
    );

    it('Country claim found, only claim for that country returned', async () => {
      // Arrange
      await update(
        'claim_sets',
        {
          claims: [
            ENTITY_TYPE_MOVIES,
            `${COUNTRY_CLAIM_PREFIX}EE`,
            `${COUNTRY_CLAIM_PREFIX}NL`,
          ],
        },
        { key: claimSetKey },
      ).run(ctx.ownerPool);

      // Act
      const claims = await validateUserClaims(
        subscriptionPlanId,
        'movie',
        'NL',
        false,
        ctx.ownerPool,
      );

      // Assert
      expect(claims).toEqual([ENTITY_TYPE_MOVIES, `${COUNTRY_CLAIM_PREFIX}NL`]);
    });

    it('Enable videos download claim is returned when allowPersistance is set to true for movies', async () => {
      // Arrange
      await update(
        'claim_sets',
        { claims: [ENTITY_TYPE_MOVIES, ENABLE_VIDEOS_DOWNLOAD] },
        { key: claimSetKey },
      ).run(ctx.ownerPool);

      // Act
      const claims = await validateUserClaims(
        subscriptionPlanId,
        'movie',
        'NL',
        true,
        ctx.ownerPool,
      );

      // Assert
      expect(claims).toEqual([ENTITY_TYPE_MOVIES, ENABLE_VIDEOS_DOWNLOAD]);
    });

    it('Enable videos download claim is not returned when allowPersistance is set to true for channels', async () => {
      // Arrange
      await update(
        'claim_sets',
        { claims: [ENTITY_TYPE_CHANNELS, ENABLE_VIDEOS_DOWNLOAD] },
        { key: claimSetKey },
      ).run(ctx.ownerPool);

      // Act
      const claims = await validateUserClaims(
        subscriptionPlanId,
        'channel',
        'NL',
        true,
        ctx.ownerPool,
      );

      // Assert
      expect(claims).toEqual([ENTITY_TYPE_CHANNELS]);
    });

    it('Enable videos download claim is not returned when allowPersistance is set to false', async () => {
      // Arrange
      await update(
        'claim_sets',
        { claims: [ENTITY_TYPE_MOVIES, ENABLE_VIDEOS_DOWNLOAD] },
        { key: claimSetKey },
      ).run(ctx.ownerPool);

      // Act
      const claims = await validateUserClaims(
        subscriptionPlanId,
        'movie',
        'NL',
        false,
        ctx.ownerPool,
      );

      // Assert
      expect(claims).toEqual([ENTITY_TYPE_MOVIES]);
    });

    it.each([QUALITY_SD, QUALITY_HD, QUALITY_UHD1, QUALITY_UHD2])(
      'Highest quality level %p returned if there are multiple claim sets',
      async (qualityClaim) => {
        // Arrange
        const qualityKey = 'QUALITY';
        await update(
          'subscription_plans',
          { claim_set_keys: [claimSetKey, qualityKey] },
          { id: subscriptionPlanId },
        ).run(ctx.ownerPool);

        await update(
          'claim_sets',
          { claims: [ENTITY_TYPE_MOVIES, QUALITY_SD] },
          { key: claimSetKey },
        ).run(ctx.ownerPool);

        await insert('claim_sets', {
          key: qualityKey,
          title: 'Quality',
          claims: [qualityClaim],
        }).run(ctx.ownerPool);

        // Act
        const claims = await validateUserClaims(
          subscriptionPlanId,
          'movie',
          'NL',
          false,
          ctx.ownerPool,
        );

        // Assert
        expect(claims).toEqual([ENTITY_TYPE_MOVIES, qualityClaim]);
      },
    );

    it('Maximum set of claims from multiple claim sets returned, some ignored', async () => {
      // Arrange
      await update(
        'subscription_plans',
        { claim_set_keys: [claimSetKey, 'QUALITY', 'DOWNLOAD', 'COUNTRY'] },
        { id: subscriptionPlanId },
      ).run(ctx.ownerPool);

      await update(
        'claim_sets',
        { claims: [ENTITY_TYPE_EPISODES] },
        { key: claimSetKey },
      ).run(ctx.ownerPool);

      await insert('claim_sets', [
        {
          key: 'QUALITY',
          title: 'Quality',
          claims: [QUALITY_UHD1],
        },
        {
          key: 'DOWNLOAD',
          title: 'Download',
          claims: [ENABLE_VIDEOS_DOWNLOAD],
        },
        {
          key: 'COUNTRY',
          title: 'Country',
          claims: [`${COUNTRY_CLAIM_PREFIX}DE`],
        },
        {
          key: 'IGNORE',
          title: 'Duplicate and unused claims',
          claims: [
            ENTITY_TYPE_MOVIES,
            ENTITY_TYPE_MOVIES,
            QUALITY_HD,
            QUALITY_HD,
            QUALITY_SD,
            QUALITY_SD,
            `${COUNTRY_CLAIM_PREFIX}EE`,
            `${COUNTRY_CLAIM_PREFIX}EE`,
            `${COUNTRY_CLAIM_PREFIX}LK`,
            `${COUNTRY_CLAIM_PREFIX}LK`,
          ],
        },
      ]).run(ctx.ownerPool);

      // Act
      const claims = await validateUserClaims(
        subscriptionPlanId,
        'episode',
        'DE',
        true,
        ctx.ownerPool,
      );

      // Assert
      expect(claims).toEqual([
        ENTITY_TYPE_EPISODES,
        `${COUNTRY_CLAIM_PREFIX}DE`,
        ENABLE_VIDEOS_DOWNLOAD,
        QUALITY_UHD1,
      ]);
    });
  });
});
