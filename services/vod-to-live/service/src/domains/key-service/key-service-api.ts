import { mosaicErrorMappingFactory } from '@axinom/mosaic-service-common';
import axios from 'axios';
import urljoin from 'url-join';
import { ContentKeyResponse } from './key-service-api-models';

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
  constructor(
    private keyServiceApiUrl: string,
    private keyServiceTenantId: string,
    private keyServiceManagementKey: string,
    private drmKeySeedId: string,
  ) {}

  public postContentKey = async (
    contentKeyName: string,
  ): Promise<ContentKeyResponse> => {
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

  public deleteContentKey = async (contentKeyId: string): Promise<void> => {
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

  public postSpekeRequest = async (request: string): Promise<string> => {
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
