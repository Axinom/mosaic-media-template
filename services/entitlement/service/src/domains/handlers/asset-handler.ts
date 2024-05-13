import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import {
  AssetHandlerInput,
  AssetHandlerResponse,
  AssetModel,
  AssetTypeProvider,
  getApolloClient,
  getFullConfig,
} from '../../common';
import { catalogQueries } from './asset-queries';

const config = getFullConfig();
const GeoBlockingFeatureSwitch = true;

export const logValidationErrors = (
  errors: ValidationError[],
  parentPath?: string,
): string[] => {
  let messages: string[] = [];
  errors.forEach((error) => {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      const errorMessages = Object.values(error.constraints).map(
        (message) => `${path} :::::: ${message}`,
      );
      messages = messages.concat(errorMessages);
    }

    if (error.children && error.children.length > 0) {
      messages = messages.concat(logValidationErrors(error.children, path));
    }
  });
  return messages;
};

const getAssetFromCatalogService = async (
  assetRequest: AssetHandlerInput,
): Promise<AssetModel> => {
  const client = await getApolloClient(config);
  const assetType: number = AssetTypeProvider.getAssetType(
    assetRequest.asset_id,
  );
  const query = catalogQueries[assetType as keyof typeof catalogQueries];

  const results = await client.query({
    query: query,
    variables: { id: assetRequest.asset_id },
  });

  return plainToClass(AssetModel, results.data.asset);
};

export const AssetHandler = async (
  assetRequest: AssetHandlerInput,
): Promise<AssetHandlerResponse> => {
  try {
    const catalogResponse: AssetModel = await getAssetFromCatalogService(
      assetRequest,
    );

    const validationErrors = await validate(catalogResponse, {
      stopAtFirstError: true,
    });

    if (validationErrors.length > 0) {
      return {
        isValid: false,
        error: {
          status: 400,
          message: logValidationErrors(validationErrors).join('\n'),
        },
        data: new AssetModel(),
      };
    }

    const mainVideo = catalogResponse.videos.nodes.find(
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
        data: new AssetModel(),
      };
    }

    return {
      isValid: true,
      data: catalogResponse,
    };
  } catch (error) {
    console.error(error); //Todo: remove console.log with proper logger.
    return {
      isValid: false,
      error: {
        status: 500,
        message: 'Internal server error',
      },
      data: new AssetModel(),
    };
  }
};
