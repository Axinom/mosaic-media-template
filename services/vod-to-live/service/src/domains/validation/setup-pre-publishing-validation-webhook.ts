import {
  Dict,
  generateWebhookResponse,
  handleWebhookErrorMiddleware,
  Logger,
  verifyWebhookRequestMiddleware,
  WebhookRequestMessage,
  WebhookResponse,
} from '@axinom/mosaic-service-common';
import { Express, Request, Response } from 'express';
import { Config, ValidationErrors } from '../../common';
import { ChannelPublishedValidationWebhookHandler } from './channel-published-validation-handler';
import { PlaylistPublishedValidationWebhookHandler } from './playlist-published-validation-handler';
import {
  PrePublishingPayload,
  ValidationWebhookHandler,
} from './validation-webhook-model';

const logger = new Logger({
  context: 'Pre-Publishing-Validation-Webhook-Handler',
});

export const setupPrePublishingValidationWebhook = (
  app: Express,
  config: Config,
): void => {
  const handlers: ValidationWebhookHandler<PrePublishingPayload>[] = [
    new ChannelPublishedValidationWebhookHandler(),
    new PlaylistPublishedValidationWebhookHandler(config),
  ];
  app.post(
    '/pre-publishing',
    verifyWebhookRequestMiddleware({
      webhookSecret: config.prePublishingWebhookSecret,
    }),
    handleWebhookErrorMiddleware,
    async (
      req: Request<
        Dict<string>,
        Dict<string>,
        WebhookRequestMessage<PrePublishingPayload>
      >,
      res: Response,
    ) => {
      const requestBody = req.body;
      let validationResponse: WebhookResponse<PrePublishingPayload> | null =
        null;
      const handler = handlers.find((h) => h.canHandle(requestBody));
      if (handler) {
        try {
          const result = handler.handle(requestBody);
          validationResponse =
            generateWebhookResponse<PrePublishingPayload>(result);
        } catch (error) {
          logger.error({
            message: `Failed to validate message of type ${requestBody.message_type}`,
            details: {
              requestBody: requestBody,
              error: error,
            },
          });
          validationResponse = generateWebhookResponse<PrePublishingPayload>({
            payload: null,
            errors: [ValidationErrors.ValidationFailed],
            warnings: [],
          });
        }
      } else {
        logger.warn({
          message: `Received message cannot be handled ${requestBody.message_type}`,
          details: { ...requestBody },
        });
        // generating response to the caller
        validationResponse = generateWebhookResponse<PrePublishingPayload>({
          payload: null,
          errors: [ValidationErrors.ValidationNotPossible],
          warnings: [],
        });
      }
      //returns status code 400, if validation result has any errors, otherwise return 200
      const statusCode = validationResponse.errors.length > 0 ? 400 : 200;
      res.status(statusCode).send(validationResponse);
    },
  );
};
