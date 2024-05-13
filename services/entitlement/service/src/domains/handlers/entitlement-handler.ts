import { EntitlementValidation } from './validations';

import {
  AssetHandler,
  RecurlyEntitlementHandler,
  UserTokenValidation,
} from '../../domains';

import {
  EntitlementRequestModel,
  EntitlementRequestType,
  EntitlementValidationResponse,
} from '../../common';

export const EntitlementHandler = async (
  entitlementRequest: EntitlementRequestModel,
): Promise<EntitlementValidationResponse> => {
  // THis handler must take care every thing related to entitlement and country code and all the other stuff

  const userId = new UserTokenValidation(
    entitlementRequest.token,
  ).getUserIdFromToken();

  const assertResponse = await AssetHandler(entitlementRequest);

  if (!assertResponse.isValid || assertResponse.data === null) {
    // TODO: Adding a Logger..................
    return {
      isValid: assertResponse.isValid,
      error: {
        status: assertResponse.error?.status ?? 400,
        message: assertResponse.error?.message ?? 'Validation failed',
      },
      data: null,
    };
  }

  // TODO: Country code should be dynamic and please use request body to get the country code
  const entitlementValidationResult = EntitlementValidation(
    assertResponse.data,
    userId ? true : false,
    'NL',
  );

  if (!entitlementValidationResult.isValid) {
    return {
      isValid: entitlementValidationResult.isValid,
      error: {
        status: entitlementValidationResult.error?.status ?? 400,
        message:
          entitlementValidationResult.error?.message ?? 'Validation failed',
      },
      data: entitlementValidationResult.data,
    };
  }

  if (entitlementValidationResult.data === null) {
    return {
      isValid: false,
      error: {
        status: 500,
        message: 'Server Error: Entitlement data is null',
      },
      data: null,
    };
  }

  if (!entitlementValidationResult.data?.Entitled) {
    if (
      entitlementRequest.entitlement_provider.toLocaleLowerCase() !==
      EntitlementRequestType.RECURLY
    ) {
      return {
        isValid: false,
        error: {
          status: 400,
          message: 'Entitlement provider is not valid',
        },
        data: entitlementValidationResult.data,
      };
    }
    const isUserSubscribed =
      await new RecurlyEntitlementHandler().VerifySubscription(
        userId ? userId : '',
      );
    if (!isUserSubscribed.isValid) {
      return {
        isValid: false,
        error: {
          status: 400,
          message:
            'Subscription is not active for user or user is not subscribed',
        },
        data: entitlementValidationResult.data,
      };
    }
    entitlementValidationResult.data.Entitled = isUserSubscribed.isValid;
  }
  entitlementValidationResult.data.keyId = entitlementRequest.key_id;

  return entitlementValidationResult;
};
