import {
  EntitlementWebhookResponsePayload,
  ManifestWebhookResponsePayload,
  PlaybackVideoWebhookRequestPayload,
  PlaybackVideoWebhookRequestPayloadSchema,
} from '@axinom/mosaic-messages';
import {
  Dict,
  generateWebhookResponse,
  handleWebhookErrorMiddleware,
  isEmptyObject,
  MosaicError,
  verifyWebhookRequestMiddleware,
  WebhookRequestMessage,
} from '@axinom/mosaic-service-common';
import { Express, NextFunction, Request, Response } from 'express';
import { CommonErrors, Config } from '../../common';
import { generateEntitlementMessageJwt } from '../../graphql/plugins/entitlement-endpoint/entitlement-message-generation';

// Feel free to adjust the implementation of this middleware to something more
// fitting to your business rules.
const validateVideoPlaybackPermissionMiddleware = (
  req: Request<
    Dict<string>,
    Dict<unknown>,
    WebhookRequestMessage<PlaybackVideoWebhookRequestPayload>
  >,
  _res: Response,
  next: NextFunction,
): void => {
  if (isEmptyObject(req.body)) {
    throw new MosaicError(CommonErrors.UnableToParseWebhookBody);
  }

  const permissions =
    req.body?.payload?.management_user?.permissions?.['ax-encoding-service'] ??
    [];
  if (!permissions.includes('VIDEOS_STREAMING')) {
    throw new MosaicError(CommonErrors.NoStreamingPermissions);
  }
  next();
};

export const setupEntitlementWebhookEndpoint = (
  app: Express,
  config: Config,
): void => {
  app.post(
    '/entitlement',
    verifyWebhookRequestMiddleware({
      webhookSecret: config.entitlementWebhookSecret,
      payloadJsonSchema: PlaybackVideoWebhookRequestPayloadSchema,
    }),
    validateVideoPlaybackPermissionMiddleware,
    handleWebhookErrorMiddleware,
    async (
      req: Request<
        Dict<string>,
        Dict<string>,
        WebhookRequestMessage<PlaybackVideoWebhookRequestPayload>
      >,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const keyIds =
          req.body?.payload?.video?.video_encoding?.video_streams?.map(
            (s) => s.key_id,
          ) ?? [];
        const jwt = generateEntitlementMessageJwt(keyIds, [], config, 'STRICT');
        const response =
          generateWebhookResponse<EntitlementWebhookResponsePayload>({
            payload: {
              entitlement_message_jwt: jwt,
              widevine_license_service_url: config.widevineLicenseServiceUrl,
              playready_license_service_url: config.playreadyLicenseServiceUrl,
              fairplay_license_service_url: config.fairplayLicenseServiceUrl,
              fairplay_streaming_certificate_url:
                config.fairplayStreamingCertificateUrl,
            },
          });
        res.status(200).send(response);
      } catch (error) {
        handleWebhookErrorMiddleware(error, req, res, next);
      }
    },
  );
};

export const setupManifestWebhookEndpoint = (
  app: Express,
  config: Config,
): void => {
  app.post(
    '/manifest',
    verifyWebhookRequestMiddleware({
      webhookSecret: config.manifestWebhookSecret,
      payloadJsonSchema: PlaybackVideoWebhookRequestPayloadSchema,
    }),
    validateVideoPlaybackPermissionMiddleware,
    handleWebhookErrorMiddleware,
    async (
      req: Request<
        Dict<string>,
        Dict<string>,
        WebhookRequestMessage<PlaybackVideoWebhookRequestPayload>
      >,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        // This can be adjusted to return some CDN URL or some other stream URL.
        // These 2 values are already used by default in the Encoding Service, so
        // if no changes are done to this webhook - it is not required to
        // configure it in the Encoding Settings in Portal Admin.
        const response =
          generateWebhookResponse<ManifestWebhookResponsePayload>({
            payload: {
              hls_manifest_url:
                req.body.payload.video.video_encoding.hls_manifest_path,
              dash_manifest_url:
                req.body.payload.video.video_encoding.dash_manifest_path,
            },
          });
        res.status(200).send(response);
      } catch (error) {
        handleWebhookErrorMiddleware(error, req, res, next);
      }
    },
  );
};
