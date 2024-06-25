import { Dict, getMappedError } from '@axinom/mosaic-service-common';
import { TransactionalInboxMessageHandler } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';

export abstract class ChannelTransactionalInboxMessageHandler<
  T,
  TContext extends Dict<unknown> = Dict<unknown>,
> extends TransactionalInboxMessageHandler<T, TContext, Config> {
  override mapError(error: Error): Error {
    return getMappedError(error);
  }
}
