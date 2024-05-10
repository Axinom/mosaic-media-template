import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import {
  EntitlementRequestModel,
  getFullConfig,
  MosaicDrmOptions,
} from '../../common';
import {
  AssetHandler,
  EntitlementTokenHandler,
  UserTokenHandler,
} from '../../domains';

const config = getFullConfig();

export const EntitlementRequestHandling = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const entitlementRequest = plainToClass(EntitlementRequestModel, req.body);
  const validationErrors = await validate(entitlementRequest, {
    stopAtFirstError: true,
  });
  if (validationErrors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationErrors.flatMap((error) =>
        Object.values(error.constraints ?? {}).map(
          (message) => `${error.property}: ${message}`,
        ),
      ),
    });
  }

  const userId = new UserTokenHandler(
    entitlementRequest.token,
  ).getUserIdFromToken();

  const assertResponse = await AssetHandler(entitlementRequest);

  if (!assertResponse.isValid) {
    // Todo: log the error and send custom error message
    if (assertResponse.error) {
      return res.status(assertResponse.error.status).send({
        success: false,
        message: assertResponse.error.message,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  const drmMosaicOptions = new MosaicDrmOptions();
  drmMosaicOptions.mosaicDrmCommunicationKey =
    config.drmLicenseCommunicationKey;
  drmMosaicOptions.mosaicDrmCommunicationKeyId =
    config.drmLicenseCommunicationKeyId;

  const entitlementTokenHandler = new EntitlementTokenHandler(drmMosaicOptions);

  const token = entitlementTokenHandler.getToken(
    true,
    assertResponse.data?.downloadedAssetLifespan,
    assertResponse.data?.keyId,
  );
  return res.send({
    drm: token,
  });
};
