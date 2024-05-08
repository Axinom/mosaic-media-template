import { Request, Response } from 'express';
import {
  AssetHandler,
  EntitlementTokenProvider,
  getFullConfig,
  MosaicDrmOptions,
} from '../../common';

const config = getFullConfig();

export const EntitlementRequestHandling = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const input = req.body;
  if (!input.asset_id || input.asset_id.length < 1) {
    return res.status(400).send({
      success: false,
      message: `Asset ID should not be empty`,
    });
  }

  if (!input.key_id || input.key_id.length < 1) {
    return res.status(400).send({
      success: false,
      message: `Key ID should not be empty`,
    });
  }

  const assertResponse = await AssetHandler(input);

  if (!assertResponse.isValid) {
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

  const _axinomEntitlementTokenProvider = new EntitlementTokenProvider(
    drmMosaicOptions,
  );

  const token = _axinomEntitlementTokenProvider.getToken(
    true,
    assertResponse.data?.downloadedAssetLifespan,
    assertResponse.data?.keyId,
  );
  return res.send({
    success: true,
    message: 'OK',
    token,
  });
};
