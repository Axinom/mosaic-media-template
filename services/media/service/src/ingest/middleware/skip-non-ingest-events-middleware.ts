import {
  MessageEnvelope,
  MessageInfo,
  OnMessageMiddleware,
} from '@axinom/mosaic-message-bus';
import { Logger } from '@axinom/mosaic-service-common';
import { IngestMessageContext } from 'media-messages';
import { AckOrNack } from 'rascal';

/**
 * Validates the message envelope 'message_context'. If ingestItemId or ingestItemStepId are not present - consumes the message without calling other middleware functions, handler.onMessage call is also skipped.
 * Shall be used only by ingest based handlers that handle events from external services.
 * @param logger Logger implementation with a debug function accepting a log object. Logs a debug message that event has been skipped.
 */
export const skipNonIngestEventsMiddleware = <TContent = unknown>(
  logger: Logger,
): OnMessageMiddleware<TContent> => {
  return async (
    content: MessageEnvelope<TContent>,
    message: MessageInfo<TContent>,
    ackOrNack: AckOrNack,
    next?: OnMessageMiddleware<TContent>,
  ): Promise<void> => {
    const messageContext = message.envelope
      .message_context as IngestMessageContext;
    if (!messageContext?.ingestItemId || !messageContext.ingestItemStepId) {
      logger.debug({
        message:
          'The event was received but skipped because the ingest-related message context was not supplied.',
        details: { message_id: message.envelope.message_id },
      });
      ackOrNack();
      return;
    }
    await next?.(content, message, ackOrNack);
  };
};
