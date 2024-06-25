import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { IsolationLevel } from 'zapatos/db';
import { Config } from '../config';
import { registerImageTypes } from './register-image-types';
import { registerLocalizationEntityDefinitions } from './register-localization-entity-definitions';
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
      // Register image types
      await registerImageTypes(storeOutboxMessage, loginClient, config);

      // Register video cue point types
      await registerVideoCuePointTypes(storeOutboxMessage, loginClient, config);

      if (config.isLocalizationEnabled) {
        // Register localization entity definitions for the media service localizable entities.
        await registerLocalizationEntityDefinitions(
          storeOutboxMessage,
          loginClient,
          config,
        );
      }
    },
  );
};
