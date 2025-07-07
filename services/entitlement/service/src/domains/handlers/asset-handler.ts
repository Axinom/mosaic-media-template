import { Logger } from '@axinom/mosaic-service-common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import {
  AssetHandlerInput,
  AssetHandlerResponse,
  AssetModel,
  AssetTypeEnum,
  AssetTypeProvider,
  getApolloClient,
  getFullConfig,
} from '../../common';
import { catalogQueries } from './asset-queries';

const config = getFullConfig();

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
  RequestClientIPHeaders: {
    'X-Client-IP': string | string[] | undefined;
    'X-Real-IP': string | string[] | undefined;
    'X-Forwarded-For': string | string[] | undefined;
  },
): Promise<AssetModel> => {
  const client = await getApolloClient(config, RequestClientIPHeaders);
  const assetType: number = AssetTypeProvider.getAssetType(
    assetRequest.asset_id,
  );
  const query = catalogQueries[assetType as keyof typeof catalogQueries];

  const results = await client.query({
    query: query,
    variables: { id: assetRequest.asset_id },
  });

  const assetData = results.data.asset;
  if (!assetData) {
    return plainToClass(AssetModel, null);
  }

  const transformed = {
    ...assetData,
    businessType:
      assetType === AssetTypeEnum.Episode
        ? assetData.season?.tvshow?.businessType
        : assetData.businessType,
  };

  return plainToClass(AssetModel, transformed);
};

export const AssetHandler = async (
  assetRequest: AssetHandlerInput,
  RequestClientIPHeaders: {
    'X-Client-IP': string | string[] | undefined;
    'X-Real-IP': string | string[] | undefined;
    'X-Forwarded-For': string | string[] | undefined;
  },
): Promise<AssetHandlerResponse> => {
  const logger = new Logger({
    config,
    context: AssetHandler.name,
  });
  try {
    const catalogResponse: AssetModel = await getAssetFromCatalogService(
      assetRequest,
      RequestClientIPHeaders,
    );

    if (!catalogResponse) {
      return {
        isValid: false,
        error: {
          status: 404,
          message: `Asset '${assetRequest.asset_id}' not found.`,
        },
        data: new AssetModel(),
      };
    }

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
      (v: { type: string; drmKeyId?: string }) => v.type === 'MAIN',
    );
    if (!mainVideo) {
      return {
        isValid: false,
        error: {
          status: 404,
          message: 'Asset do not have valid main video',
        },
        data: new AssetModel(),
      };
    }

    if (!mainVideo.isProtected) {
      return {
        isValid: false,
        error: {
          status: 404,
          message: 'This endpoint can only be used for drm enabled content',
        },
        data: new AssetModel(),
      };
    }

    if (!mainVideo.drmKeyId || mainVideo.drmKeyId !== assetRequest.key_id) {
      return {
        isValid: false,
        error: {
          status: 404,
          message: 'Asset key_id does not match with the video key_id',
        },
        data: new AssetModel(),
      };
    }

    return {
      isValid: true,
      data: catalogResponse,
    };
  } catch (error) {
    logger.error({
      name: 'AssetHandler throw an 500 server error',
      message: (error as Error).message,
    });
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
