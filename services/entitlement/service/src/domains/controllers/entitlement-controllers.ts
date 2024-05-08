import { Request, Response } from 'express';
import {
  EntitlementTokenProvider,
  getFullConfig,
  MosaicDrmOptions,
} from '../../common';

const config = getFullConfig();

export const EntitlementRequestHandling = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const requestBody = req.body;
  if (!requestBody.asset_id || requestBody.asset_id.length < 1) {
    return res.status(400).send({
      code: 0,
      message: `Asset ID should not be empty`,
    });
  }

  if (!requestBody.key_id || requestBody.key_id.length < 1) {
    return res.status(400).send({
      code: 0,
      message: `Key ID should not be empty`,
    });
  }

  // const assertResponse = await AssetHandler(input);

  // Mocking the response of catalog service
  const assertResponse = {
    isValid: true,
    data: {
      assetId: requestBody.asset_id,
      keyId: requestBody.key_id,
      downloadedAssetLifespan: 30,
    },
  };

  // if (!assertResponse.isValid) {
  //   if (assertResponse.error) {
  //     return res.status(assertResponse.error.status).send({
  //       success: false,
  //       message: assertResponse.error.message,
  //     });
  //   } else {
  //     return res.status(500).send({
  //       success: false,
  //       message: 'Internal Server Error',
  //     });
  //   }
  // }

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
    drm: token,
  });
};
