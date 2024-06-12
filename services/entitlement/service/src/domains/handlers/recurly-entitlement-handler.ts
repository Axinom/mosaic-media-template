import { Logger } from '@axinom/mosaic-service-common';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import {
  getFullConfig,
  RecurlyEntitlement,
  RecurlyEntitlementErrorResponse,
  RecurlyEntitlementResponse,
} from '../../common';

const config = getFullConfig();
export class RecurlyEntitlementHandler {
  private recurlyEntitlementApiUrl: string;
  private recurlyEncodedApiKey: string;
  private recurlyRequestAccept: string;
  private recurlyEntitlementPlaybackPermission: string;

  private subscriptionNotFoundCodes = ['immutable_subscription', 'not_found'];
  private rateLimitedErrorCodes = ['simultaneous_request', 'rate_limited'];

  constructor() {
    // this.options = config.recurlyEntitlementOptions;
    this.recurlyEntitlementApiUrl = config.recurlyEntitlementApiUrl;
    this.recurlyEncodedApiKey = Buffer.from(
      `${config.recurlyEntitlementApiKey}:`,
    ).toString('base64');
    this.recurlyRequestAccept = 'application/vnd.recurly.v2021-02-25';
    this.recurlyEntitlementPlaybackPermission =
      config.recurlyEntitlementPlaybackPermission;
  }

  async VerifySubscription(
    userId: string,
  ): Promise<RecurlyEntitlementResponse> {
    const logger = new Logger({
      config,
      context: this.VerifySubscription.name,
    });
    // TODO: I had to hard code the user ID here, cause NFN user is broken from Recurly end.
    userId = 'b2ef064e-886f-4230-8c76-6e01d27e2080';
    const url = `${this.recurlyEntitlementApiUrl}/accounts/code-${userId}/entitlements`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${this.recurlyEncodedApiKey}`,
          Accept: this.recurlyRequestAccept,
          Type: 'application/json',
        },
      });

      const entitlements: RecurlyEntitlement = plainToClass(
        RecurlyEntitlement,
        response.data,
      );
      if (response.status === 200) {
        const isValid = entitlements.data.some(
          (r) =>
            r.customerPermission.code ===
            this.recurlyEntitlementPlaybackPermission,
        );
        if (!isValid) {
          logger.log({
            name: 'Recurly entitlement permission denied',
            message: `Recurly Entitlement API permission denied for ${userId} returned object: ${JSON.stringify(
              entitlements,
            )}`,
          });
        }
        return {
          isValid: isValid,
        };
      } else {
        const errorRes: RecurlyEntitlementErrorResponse = plainToClass(
          RecurlyEntitlementErrorResponse,
          response.data,
        );
        let msg = 'Recurly Entitlement API returned an error';
        if (this.subscriptionNotFoundCodes.includes(errorRes?.error?.type)) {
          (msg = 'Recurly subscription not found'),
            logger.debug({
              name: 'Recurly subscription not found',
              message: `Recurly Entitlement API didn't find subscription for ${userId}. Error: ${errorRes?.error?.type}`,
            });
        }
        if (this.rateLimitedErrorCodes.includes(errorRes?.error?.type)) {
          (msg = 'Recurly API rate limit error'),
            logger.error({
              name: 'Recurly API rate limit error',
              message: `Recurly entitlement request rate limited. URL : ${url}. Error: ${errorRes?.error?.type}`,
            });
        } else {
          logger.error({
            name: 'Recurly API error',
            message: `Recurly Entitlement API returned an error ${errorRes?.error?.type}`,
          });
        }
        return {
          isValid: false,
          error: {
            status: response.status,
            message: msg,
          },
        };
      }
    } catch (error) {
      logger.error({
        name: 'Recurly API error',
        message: `Recurly Entitlement API throw an error ${error}`,
      });
      return {
        //Todo: Log the error please.
        isValid: false,
        error: {
          status: 500,
          message: 'Recurly Entitlement API returned an error',
        },
      };
    }
  }
}
