import {
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import { ClientError, GraphQLClient } from 'graphql-request';
import urljoin from 'url-join';
import { CommonErrors } from '../../../common';
import { getSdk } from '../../../generated/graphql/billing';

const getBillingMappedError = mosaicErrorMappingFactory(
  (error: Partial<ClientError> & { code?: string }) => {
    if (error instanceof ClientError) {
      return {
        ...CommonErrors.BillingErrors,
        details: { errors: error.response.errors },
      };
    }

    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      return CommonErrors.BillingConnectionFailed;
      /*return {
        ...CommonErrors.BillingConnectionFailed,
        details: {
          code: error.code,
          message: error.message,
        },
      };*/
    }

    return undefined;
  },
);

export const getSubscriptionPlanId = async (
  billingUrl: string,
  token: string | undefined,
): Promise<string> => {
  try {
    const client = new GraphQLClient(urljoin(billingUrl, 'graphql'));
    const { GetActiveSubscription } = getSdk(client);
    const result = await GetActiveSubscription(
      { now: new Date().toISOString() },
      { Authorization: `Bearer ${token}` },
    );

    const subscription = result.data?.subscriptions?.nodes?.[0];
    if (!subscription) {
      throw new MosaicError({
        message: `User does not have an active subscription.`,
        code: CommonErrors.SubscriptionValidationError.code,
      });
    }

    return subscription.subscriptionPlanId;
  } catch (error) {
    throw getBillingMappedError(error);
  }
};
