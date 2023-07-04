import {
  MosaicError,
  mosaicErrorMappingFactory,
} from '@axinom/mosaic-service-common';
import axios from 'axios';
import urljoin from 'url-join';
import { Config } from '../../common';
import { ContentKeyResponse } from './key-service-api-models';

export const KeyServiceApiErrors = {
  DrmIsDisabled: {
    message: 'DRM protection is disabled.',
    code: 'DRM_IS_DISABLED',
  },
};

const getKeyServiceApiMappedError = mosaicErrorMappingFactory(
  (
    error: Error & {
      response?: {
        status?: unknown;
        data?: unknown;
      };
    },
  ) => {
    return {
      message: error.message,
      code: 'KEY_SERVICE_API_ERROR',
      details: {
        status: error?.response?.status,
        data: error?.response?.data,
      },
    };
  },
);

export class KeyServiceApi {
  private keyServiceApiUrl?: string;
  private keyServiceTenantId?: string;
  private keyServiceManagementKey?: string;
  private drmKeySeedId?: string;
  constructor(config: Config) {
    if (config.isDrmEnabled) {
      this.keyServiceApiUrl = config.keyServiceApiBaseUrl;
      this.keyServiceTenantId = config.keyServiceTenantId;
      this.keyServiceManagementKey = config.keyServiceManagementKey;
      this.drmKeySeedId = config.drmKeySeedId;
    }
  }

  /**
   * Creates a new content key for DRM protection.
   * @param contentKeyName - name of the content key.
   * @returns - response from Key Service.
   */
  public postContentKey = async (
    contentKeyName: string,
  ): Promise<ContentKeyResponse> => {
    if (!this.keyServiceApiUrl) {
      throw new MosaicError({
        ...KeyServiceApiErrors.DrmIsDisabled,
        details: { errorMessage: 'Key Service API url is not set.' },
      });
    }
    try {
      const result = await axios.post<ContentKeyResponse>(
        urljoin(this.keyServiceApiUrl, 'api', 'ContentKeys'),
        {
          Name: contentKeyName,
          KeySeedId: this.drmKeySeedId,
        },
        {
          headers: {
            Authorization: `Basic ${this.getAuthorizationToken()}`,
          },
        },
      );
      return result.data;
    } catch (error) {
      throw getKeyServiceApiMappedError(error);
    }
  };

  /**
   * Deletes a content key for DRM protection.
   * @param contentKeyId - content key unique identifier.
   */
  public deleteContentKey = async (contentKeyId: string): Promise<void> => {
    if (!this.keyServiceApiUrl) {
      throw new MosaicError({
        ...KeyServiceApiErrors.DrmIsDisabled,
        details: { errorMessage: 'Key Service API url is not set.' },
      });
    }
    try {
      await axios.delete(
        urljoin(this.keyServiceApiUrl, 'api', 'ContentKeys', contentKeyId),
        {
          headers: {
            Authorization: `Basic ${this.getAuthorizationToken()}`,
          },
        },
      );
    } catch (error) {
      throw getKeyServiceApiMappedError(error);
    }
  };

  /**
   * Generates CPIX according to the SPEKE CPIX key exchange protocol.
   * @param request - CPIX request.
   */
  public postSpekeRequest = async (request: string): Promise<string> => {
    if (!this.keyServiceApiUrl) {
      throw new MosaicError({
        ...KeyServiceApiErrors.DrmIsDisabled,
        details: { errorMessage: 'Key Service API url is not set.' },
      });
    }
    try {
      const result = await axios.post<string>(
        urljoin(this.keyServiceApiUrl, 'api', 'SpekeV2'),
        request,
        {
          headers: {
            Authorization: `Basic ${this.getAuthorizationToken()}`,
            // Mandatory header for SpekeV2
            'X-Speke-Version': '2.0',
          },
        },
      );
      return result.data;
    } catch (error) {
      throw getKeyServiceApiMappedError(error);
    }
  };

  private getAuthorizationToken = (): string => {
    return Buffer.from(
      `${this.keyServiceTenantId}:${this.keyServiceManagementKey}`,
      'binary',
    ).toString('base64');
  };
}
