import {
  applyDefaultPollingListenerConfigValues,
  defaultMessageRetryStrategy,
  ExtendedError,
  MessageRetryStrategy,
  PollingListenerConfig,
  StoredTransactionalMessage,
} from 'pg-transactional-outbox';

/**
 * Custom retry strategy config. Sets the max retry amount to 10 for
 * ingest-related messages to account for ingests with high amount of items.
 */
export const ingestMessageRetryStrategy = (
  ingestMessageTypes: string[],
  config: PollingListenerConfig,
): MessageRetryStrategy => {
  const fullConfig = applyDefaultPollingListenerConfigValues(config);
  const defaultStrategy = defaultMessageRetryStrategy(fullConfig);
  return (
    message: StoredTransactionalMessage,
    error: ExtendedError,
    source: 'message-handler' | 'error-handler' | 'error-handler-error',
  ): boolean => {
    if (
      ingestMessageTypes.includes(message.messageType) &&
      message.startedAttempts < 10
    ) {
      return true;
    }
    return defaultStrategy(message, error, source);
  };
};
