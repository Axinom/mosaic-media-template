import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import {
  WebhookRequestMessage,
  WebhookResponse,
} from '@axinom/mosaic-service-common';
import { Config, ValidationErrors } from '../../common';
import { validateVideo, ValidationResult } from './utils';
import { ValidationWebhookHandler } from './validation-webhook-model';

export class ChannelPublishedValidationWebhookHandler
  implements ValidationWebhookHandler<ChannelPublishedEvent>
{
  constructor(private config: Config) {}

  canHandle(message: WebhookRequestMessage<ChannelPublishedEvent>): boolean {
    return (
      message.message_type ===
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType
    );
  }
  async handle(
    message: WebhookRequestMessage<ChannelPublishedEvent>,
  ): Promise<WebhookResponse<ChannelPublishedEvent>> {
    const validationResult: ValidationResult = {
      errors: [],
      warnings: [],
    };
    const event = message.payload;
    if (!event.placeholder_video) {
      validationResult.errors.push(
        ValidationErrors.ChannelMissingPlaceholderVideo,
      );
    } else {
      const { errors: videoErrors, warnings: videoWarnings } = validateVideo(
        event.placeholder_video,
        this.config,
      );
      validationResult.errors.push(...videoErrors);
      validationResult.warnings.push(...videoWarnings);
    }
    return {
      payload: validationResult.errors.length > 0 ? null : event,
      ...validationResult,
    };
  }
}
