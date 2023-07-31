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
  transformJsonSchemaValidationErrors,
  verifyWebhookRequestMiddleware,
  WebhookErrors,
  WebhookRequestMessage,
} from '@axinom/mosaic-service-common';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Express, json, NextFunction, Request, Response } from 'express';
import { CommonErrors, Config, sanitizeStringArray } from '../../common';
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

/**
 * Middleware to validate Webhook requests, when service is in DEMO mode.
 */
const verifyDemoWebhookRequestMiddleware = (
  payloadJsonSchema?: Record<string, unknown>,
  expirationInSeconds?: number,
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return json({
    verify: (req: Request, _res: Response, buffer: Buffer): void => {
      const requestBody = buffer.toString();
      expirationInSeconds = expirationInSeconds ?? 120;
      const parsedBody: WebhookRequestMessage<PlaybackVideoWebhookRequestPayload> =
        typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;
      if (payloadJsonSchema) {
        const ajv = new Ajv({
          strict: 'log', // disable throwing on strict errors https://ajv.js.org/strict-mode.html#ignored-additionalitems-keyword
          allErrors: true,
        });
        addFormats(ajv);
        const validate = ajv.compile(payloadJsonSchema);
        validate(parsedBody.payload);

        const errors = transformJsonSchemaValidationErrors(validate.errors);

        if (errors.length > 0) {
          throw new MosaicError({
            ...WebhookErrors.WebhookPayloadValidationFailed,
            details: { validationMessages: errors.map((e) => e.message) },
          });
        }
      }

      const now = new Date().getTime();
      const sent = new Date(parsedBody.timestamp).getTime();
      const secondsSinceRequest = (now - sent) / 1000;
      if (secondsSinceRequest > expirationInSeconds) {
        throw new MosaicError({
          ...WebhookErrors.OutdatedWebhookRequest,
          messageParams: [Math.round(secondsSinceRequest)],
        });
      }
    },
  });
};

export const setupEntitlementWebhookEndpoint = (
  app: Express,
  config: Config,
): void => {
  app.post(
    '/entitlement',
    config.demoMode
      ? verifyDemoWebhookRequestMiddleware(
          PlaybackVideoWebhookRequestPayloadSchema,
        )
      : verifyWebhookRequestMiddleware({
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
        const keyIds = sanitizeStringArray(
          req.body?.payload?.video?.video_encoding?.video_streams?.map(
            (s) => s.key_id,
          ),
        );
        const jwt = generateEntitlementMessageJwt(
          keyIds,
          [],
          config,
          config.isDev ? 'DEV' : 'STRICT',
        );
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
    config.demoMode
      ? verifyDemoWebhookRequestMiddleware(
          PlaybackVideoWebhookRequestPayloadSchema,
        )
      : verifyWebhookRequestMiddleware({
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
        // These 2 values are already used by default in the Video Service, so
        // if no changes are done to this webhook - it is not required to
        // configure it in the Video Settings in Portal Admin.
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
