import { isNullOrWhitespace, Logger, validateWebhookRequest } from '@axinom/mosaic-service-common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import {
  PreviewEntitlementRequestModel,
  MosaicDrmOptions,
  getFullConfig,
} from '../../common';
import { EntitlementTokenHandler } from '../../domains';

const getKeyId = (req: PreviewEntitlementRequestModel): string | undefined => 
    req.payload.video.video_encoding.video_streams.find( s => !isNullOrWhitespace(s.key_id))?.key_id

const config = getFullConfig();

export const PreviewEntitlementRequestHandling = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const logger = new Logger({
      config,
      context: PreviewEntitlementRequestHandling.name,
    });
    console.log(req.body);
    const signature = req.get(config.entitlementWebhookSignatureHeader);
    if(!signature) {
      const msg = 'Invalid signature';
      logger.error({
        name: 'Unauthorized',
        message: msg,
      });
      return res.status(401).json({
        message: 'Unauthorized',
        errors: msg,
      });
    }
    validateWebhookRequest({requestBody: req.body, requestSignature: signature, webhookSecret: config.entitlementWebhookSecret})
    const previewEntitlementRequest = plainToClass(PreviewEntitlementRequestModel, req.body);
    const validationErrors = await validate(previewEntitlementRequest, {
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
    
    const drmMosaicOptions = new MosaicDrmOptions();
    drmMosaicOptions.mosaicDrmCommunicationKey =
      config.drmLicenseCommunicationKey;
    drmMosaicOptions.mosaicDrmCommunicationKeyId =
      config.drmLicenseCommunicationKeyId;
    const entitlementTokenHandler = new EntitlementTokenHandler(drmMosaicOptions);
    const token = entitlementTokenHandler.getToken(
      false,
      undefined,
      getKeyId(previewEntitlementRequest),
    );
    const entitlement = {
      entitlement_message_jwt: token,
      widevine_license_service_url: config.widevineLicenseServiceUrl,
      playready_license_service_url: config.playreadyLicenseServiceUrl,
      fairplay_license_service_url: config.fairPlayLicenseServiceUrl,
      fairplay_streaming_certificate_url: config.fairplayStreamingCertificateUrl
    };
    return res.send({payload: entitlement});
  };
  