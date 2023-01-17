import {
  ChannelPublishedEvent,
  ChannelServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import {
  WebhookRequestMessage,
  WebhookResponse,
} from '@axinom/mosaic-service-common';
import { ValidationErrors } from '../../common';
import { validateVideo, ValidationResult } from './utils';
import { ValidationWebhookHandler } from './validation-webhook-model';

export class ChannelPublishedValidationWebhookHandler
  implements ValidationWebhookHandler<ChannelPublishedEvent>
{
  canHandle(message: WebhookRequestMessage<ChannelPublishedEvent>): boolean {
    return (
      message.message_type ===
      ChannelServiceMultiTenantMessagingSettings.ChannelPublished.messageType
    );
  }
  handle(
    message: WebhookRequestMessage<ChannelPublishedEvent>,
  ): WebhookResponse<ChannelPublishedEvent> {
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
