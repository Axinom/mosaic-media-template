import { Dict, getMappedError } from '@axinom/mosaic-service-common';
import { TransactionalInboxMessageHandler } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';

export abstract class MediaTransactionalInboxMessageHandler<
  T,
  TContext extends Dict<unknown> = Dict<unknown>,
> extends TransactionalInboxMessageHandler<T, Config, TContext> {
  override mapError(error: Error): Error {
    return getMappedError(error);
  }
}
