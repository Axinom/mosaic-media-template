import {
  ChannelPublishedEvent,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import {
  WebhookRequestMessage,
  WebhookResponse,
} from '@axinom/mosaic-service-common';

export type PrePublishingPayload =
  | PlaylistPublishedEvent
  | ChannelPublishedEvent;

export interface ValidationWebhookHandler<T> {
  canHandle(message: WebhookRequestMessage<T>): boolean;
  handle(message: WebhookRequestMessage<T>): WebhookResponse<T>;
}
