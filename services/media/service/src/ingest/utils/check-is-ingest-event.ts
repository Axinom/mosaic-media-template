import {
  InboxOutboxLogger,
  TransactionalMetadata,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { IngestMessageContext } from 'media-messages';

export const checkIsIngestEvent = <TContent = unknown>(
  metadata: TransactionalMetadata<TContent>,
  logger: InboxOutboxLogger,
  messageId: string,
  aggregateId: string,
): boolean => {
  const messageContext = metadata.messageContext as IngestMessageContext;
  if (!messageContext?.ingestItemId || !messageContext.ingestItemStepId) {
    logger.debug({
      message:
        'The event was received but skipped because the ingest-related message context was not supplied.',
      details: { message_id: messageId, aggregate_id: aggregateId },
    });
    return false;
  }
  return true;
};
