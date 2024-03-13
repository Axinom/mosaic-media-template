import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { IsolationLevel } from 'zapatos/db';
import { Config } from '../common';
import { registerImageTypes } from './register-image-types';
import { registerVideoCuePointTypes } from './register-video-cue-point-types';

export const registerTypes = async (
  storeOutboxMessage: StoreOutboxMessage,
  loginPool: LoginPgPool,
  config: Config,
): Promise<void> => {
  await transactionWithContext(
    loginPool,
    IsolationLevel.Serializable,
    { role: config.dbGqlRole },
    async (loginClient) => {
      // Register image types used in the media service.
      await registerImageTypes(storeOutboxMessage, loginClient, config);

      // Register video cue point types used in media service.
      await registerVideoCuePointTypes(storeOutboxMessage, loginClient, config);
    },
  );
};
