import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import {
  AssetModel,
  AssetTypeProvider,
  getApolloClient,
  getFullConfig,
} from '../../common';
import { catalogQueries } from './asset-queries';

interface AssetHandlerInput {
  asset_id: string;
  key_id: string;
}

interface AssetHandlerResponse {
  isValid: boolean;
  data?: {
    assetId: string;
    keyId: string;
    isDownloadable: boolean;
    downloadedAssetLifespan: number;
  };
  error?: { status: number; message: string };
}
const config = getFullConfig();

export const AssetHandler = async (
  assetRequest: AssetHandlerInput,
): Promise<AssetHandlerResponse> => {
  if (
    !assetRequest.asset_id ||
    assetRequest.asset_id.length < 0 ||
    !assetRequest.key_id ||
    assetRequest.key_id.length < 0
  ) {
    return {
      isValid: false,
      error: {
        status: 400,
        message: 'Invalid input, Asset ID and Key ID are required',
      },
    };
  }
  try {
    const client = await getApolloClient(config);
    const assetType: number = AssetTypeProvider.getAssetType(
      assetRequest.asset_id,
    );
    const query = catalogQueries[assetType as keyof typeof catalogQueries];

    const results = await client.query({
      query: query,
      variables: { id: assetRequest.asset_id },
    });

    //Todo: Select type based on asset type extractor.
    const queryResponse = plainToClass(AssetModel, results.data.asset);
    const validationErrors = await validate(queryResponse);

    if (validationErrors.length > 0) {
      return {
        isValid: false,
        error: {
          status: 400,
          message: `Validation error: ${validationErrors}`,
        },
      };
    }

    const mainVideo = queryResponse.videos.nodes.find(
      (v: { type: string; drmKeyId?: string }) =>
        v.type === 'MAIN' && v.drmKeyId === assetRequest.key_id,
    );
    if (!mainVideo) {
      return {
        isValid: false,
        error: {
          status: 404,
          message: 'Movie or its DRM keys not found',
        },
      };
    }

    //Todo: check the correct logic and implement the correct logic for downloadedAssetLifespans
    const downloadedAssetLifespans = queryResponse.licenses.nodes
      .filter(
        (d: { isDownloadable: boolean; downloadedAssetLifespan: number }) =>
          d.isDownloadable === true && d.downloadedAssetLifespan > 0,
      )
      .map((d: { downloadedAssetLifespan: any }) => d.downloadedAssetLifespan);

    // TODO: Implement the logic to check if the asset is downloadable correctly and may need country filters and everything
    return {
      isValid: true,
      data: {
        assetId: assetRequest.asset_id,
        keyId: assetRequest.key_id,
        isDownloadable: downloadedAssetLifespans.length > 0,
        downloadedAssetLifespan:
          downloadedAssetLifespans.length > 0 ? downloadedAssetLifespans[0] : 0,
      },
    };
  } catch (error) {
    console.error(error); //Todo: remove console.log with proper logger.
    return {
      isValid: false,
      error: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
