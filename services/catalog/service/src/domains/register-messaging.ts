import { getLoginPgPool } from '@axinom/mosaic-db-common';
import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { Express } from 'express';
import { Config } from '../common';
import { registerCollectionsMessaging } from './collections/register-collections-messaging';
import { registerMoviesMessaging } from './movies/register-movies-messaging';
import { registerTvshowsMessaging } from './tvshows/register-tvshows-messaging';

// Constructs an array of rascal config builders for each registered message subscription/publishing config.
export function registerMessaging(
  app: Express,
  config: Config,
): RascalConfigBuilder[] {
  const loginPool = getLoginPgPool(app);
  return [
    ...registerMoviesMessaging(config, loginPool),
    ...registerTvshowsMessaging(config, loginPool),
    ...registerCollectionsMessaging(config, loginPool),
  ];
}
