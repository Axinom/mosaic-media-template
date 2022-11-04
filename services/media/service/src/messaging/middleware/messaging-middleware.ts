/* eslint-disable no-console */
import {
  envelopeLoggingMiddleware,
  OnMessageMiddleware,
  randomDelayMiddleware,
  randomErrorMiddleware,
} from '@axinom/mosaic-message-bus';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../../common';

export const getMessagingMiddleware = (
  config: Config,
  logger?: Logger,
): OnMessageMiddleware[] => {
  logger = logger ?? new Logger({ context: getMessagingMiddleware.name });
  const middleware = [envelopeLoggingMiddleware(logger)];
  if (config.rmqDevMiddleware) {
    middleware.push(randomErrorMiddleware(20));
    middleware.push(randomDelayMiddleware(50, 0.5));
  }
  return middleware;
};
