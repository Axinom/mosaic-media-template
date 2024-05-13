import axios from 'axios';
import { plainToClass } from 'class-transformer';
import {
  getFullConfig,
  RecurlyEntitlement,
  RecurlyEntitlementResponse,
} from '../../common';

const config = getFullConfig();
export class RecurlyEntitlementHandler {
  private recurlyEntitlementApiUrl: string;
  private recurlyEncodedApiKey: string;
  private recurlyRequestAccept: string;
  private recurlyEntitlementPlaybackPermission: string;

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
    // Todo: Need to handel rate limited errors and maybe add some retry logic if that makes sense
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
        return {
          isValid: isValid,
        };
      } else {
        //Todo: Log the error please.
        return {
          isValid: false,
          error: {
            status: response.status,
            message: 'Recurly Entitlement API returned an error',
          },
        };
      }
    } catch (error) {
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
