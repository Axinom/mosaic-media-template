import { LoginPgPool } from '@axinom/mosaic-db-common';
import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { Config } from '../../common';

export interface ContentTypeRegistrant {
  /**
   * Registers all message handlers associated with a content type.
   * Typically there are two: one for handling published events and one for handling unpublished events.
   * @param config - Catalog service configuration object.
   * @param loginPool - PostGraphile's login pool.
   */
  (config: Config, loginPool: LoginPgPool): RascalConfigBuilder[];
}
