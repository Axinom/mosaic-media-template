import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import { pluralize } from 'inflection';
import { parent, select, selectOne, self as value, SQL, sql } from 'zapatos/db';
import { CommonErrors } from '../../../common';
import {
  COUNTRY_CLAIM_PREFIX,
  ENABLE_VIDEOS_DOWNLOAD,
  ENTITY_TYPE_EPISODES,
  ENTITY_TYPE_MOVIES,
  QUALITY_HD,
  QUALITY_SD,
  QUALITY_UHD1,
  QUALITY_UHD2,
} from '../../../domains';
import { EntityWithVideoType } from './catalog-service-communication';

const getAppliedClaims = async (
  subscriptionPlanId: string,
  ownerPool: OwnerPgPool,
): Promise<string[]> => {
  const subscriptionPlan = await selectOne(
    'subscription_plans',
    { id: subscriptionPlanId },
    {
      columns: ['id'],
      lateral: {
        claimSets: select(
          'claim_sets',
          { key: sql<SQL>`${value} = ANY(${parent('claim_set_keys')})` },
          { columns: ['claims'] },
        ),
      },
    },
  ).run(ownerPool);

  if (!subscriptionPlan) {
    throw new MosaicError({
      message: `Subscription Plan not found. Please re-publish claim sets and subscription plans or contact the service support.`,
      code: CommonErrors.SubscriptionValidationError.code,
    });
  }

  return subscriptionPlan.claimSets.reduce<string[]>(
    (result, currentElement) => [
      ...new Set([...result, ...currentElement.claims]),
    ],
    [],
  );
};

export const validateUserClaims = async (
  subscriptionPlanId: string,
  type: EntityWithVideoType,
  countryCode: string,
  allowPersistence: boolean,
  ownerPool: OwnerPgPool,
): Promise<string[]> => {
  const appliedClaims = await getAppliedClaims(subscriptionPlanId, ownerPool);

  if (appliedClaims.length === 0) {
    const moviesOrEpisodes = pluralize(type);
    throw new MosaicError({
      message: `The users subscription does not allow playback of ${moviesOrEpisodes} as it does not define any claims.`,
      code: CommonErrors.SubscriptionValidationError.code,
    });
  }

  // Validation
  if (type === 'movie' && !appliedClaims.includes(ENTITY_TYPE_MOVIES)) {
    throw new MosaicError({
      message: `Users subscription does not allow playback of movies.`,
      code: CommonErrors.SubscriptionValidationError.code,
    });
  }

  if (type === 'episode' && !appliedClaims.includes(ENTITY_TYPE_EPISODES)) {
    throw new MosaicError({
      message: `Users subscription does not allow playback of episodes.`,
      code: CommonErrors.SubscriptionValidationError.code,
    });
  }

  if (allowPersistence && !appliedClaims.includes(ENABLE_VIDEOS_DOWNLOAD)) {
    throw new MosaicError({
      message: `License persistence was requested, but Enable Videos Download claim was not found.`,
      code: CommonErrors.SubscriptionValidationError.code,
    });
  }

  const countryClaims = appliedClaims.filter((claim) =>
    claim.startsWith(COUNTRY_CLAIM_PREFIX),
  );
  if (
    countryClaims.length > 0 &&
    !countryClaims.includes(`${COUNTRY_CLAIM_PREFIX}${countryCode}`)
  ) {
    throw new MosaicError({
      message: `Playback is not allowed in your current country (${countryCode}).`,
      code: CommonErrors.SubscriptionValidationError.code,
    });
  }

  // Claims selection
  const claimsToReturn = [];
  if (type === 'movie') {
    claimsToReturn.push(ENTITY_TYPE_MOVIES);
  } else {
    claimsToReturn.push(ENTITY_TYPE_EPISODES);
  }

  if (countryClaims.length > 0) {
    claimsToReturn.push(`${COUNTRY_CLAIM_PREFIX}${countryCode}`);
  }

  // double-checking the claim inclusion to be extra sure
  if (allowPersistence && appliedClaims.includes(ENABLE_VIDEOS_DOWNLOAD)) {
    claimsToReturn.push(ENABLE_VIDEOS_DOWNLOAD);
  }

  if (appliedClaims.includes(QUALITY_UHD2)) {
    claimsToReturn.push(QUALITY_UHD2);
  } else if (appliedClaims.includes(QUALITY_UHD1)) {
    claimsToReturn.push(QUALITY_UHD1);
  } else if (appliedClaims.includes(QUALITY_HD)) {
    claimsToReturn.push(QUALITY_HD);
  } else if (appliedClaims.includes(QUALITY_SD)) {
    claimsToReturn.push(QUALITY_SD);
  }

  return claimsToReturn;
};
