import { getOwnerPgPool } from '@axinom/mosaic-db-common';
import { Logger } from '@axinom/mosaic-service-common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import {
  EntitlementRequestModel,
  extractCountryCodeFromRemoteIP,
  getFullConfig,
  MosaicDrmOptions,
} from '../../common';
import { EntitlementHandler, EntitlementTokenHandler } from '../../domains';

const config = getFullConfig();

export const EntitlementRequestHandling = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const logger = new Logger({
    config,
    context: EntitlementRequestHandling.name,
  });
  const ownerPool = getOwnerPgPool(req.app);
  const entitlementRequest = plainToClass(EntitlementRequestModel, req.body);
  const validationErrors = await validate(entitlementRequest, {
    stopAtFirstError: true,
  });
  if (validationErrors.length > 0) {
    const errorMessages: string[] = validationErrors.flatMap((error) =>
      Object.values(error.constraints ?? {}).map(
        (message) => `${error.property}: ${message}`,
      ),
    );
    logger.error({
      name: 'Validation failed',
      message: errorMessages.join('\n'),
    });

    return res.status(400).json({
      message: 'Validation fail',
      errors: errorMessages,
    });
  }

  const countryCode = await extractCountryCodeFromRemoteIP(req);

  const entitlement = await EntitlementHandler(entitlementRequest, countryCode);

  if (!entitlement.isValid) {
    if (entitlement.error) {
      logger.debug({
        name: 'Entitlement denied',
        message: `Entitlement denied for asset ${entitlementRequest.asset_id}. Error : ${entitlement.error.message}`,
      });
      return res.status(entitlement.error.status).send({
        success: false,
        message: `Entitlement denied. Error : ${entitlement.error.message}`,
      });
    } else {
      logger.error({
        name: 'Entitlement failed',
        message: `Entitlement failed for asset ${entitlementRequest.asset_id}. Error : internal Server Error`,
      });
      return res.status(500).send({
        success: false,
        message: `Entitlement failed. Error : internal Server Error`,
      });
    }
  }

  const drmMosaicOptions = new MosaicDrmOptions();
  drmMosaicOptions.mosaicDrmCommunicationKey =
    config.drmLicenseCommunicationKey;
  drmMosaicOptions.mosaicDrmCommunicationKeyId =
    config.drmLicenseCommunicationKeyId;

  const entitlementTokenHandler = new EntitlementTokenHandler(drmMosaicOptions);

  try {
    const token = entitlementTokenHandler.getToken(
      true,
      entitlement.data?.DownloadDuration,
      entitlement.data?.keyId,
    );
    return res.send({
      drm: token,
    });
  } catch (error) {
    logger.error({
      name: 'Entitlement token generation failed',
      message: `Entitlement token generation failed for asset ${
        entitlementRequest.asset_id
      }. Error : ${error}, Data: ${JSON.stringify(entitlement)}`,
    });
    return res.status(500).send({
      success: false,
      message: `Entitlement token generation failed.`,
    });
  }
};
