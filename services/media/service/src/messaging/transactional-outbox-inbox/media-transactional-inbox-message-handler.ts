import { Dict, getMappedError } from '@axinom/mosaic-service-common';
import {
  DbConfig,
  TransactionalInboxMessageHandler,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';

export abstract class MediaTransactionalInboxMessageHandler<
  T,
  TContext extends Dict<unknown> = Dict<unknown>,
  TConfig extends DbConfig = DbConfig & Config, // TODO: might need adjustments after mosaic libs update
> extends TransactionalInboxMessageHandler<T, TContext, TConfig> {
  override mapError(error: Error): Error {
    return getMappedError(error);
  }
}
