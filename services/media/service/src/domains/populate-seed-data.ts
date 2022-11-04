import { getOwnerPgPool } from '@axinom/mosaic-db-common';
import { Logger } from '@axinom/mosaic-service-common';
import { Express } from 'express';
import { MovieGenresSeedDataHandler } from './movies';
import { TvshowGenresSeedDataHandler } from './tvshows';

export const populateSeedData = async (
  app: Express,
  logger: Logger = new Logger({ context: `populateSeedData` }),
): Promise<void> => {
  const pgPool = getOwnerPgPool(app);
  const handlers = [
    new MovieGenresSeedDataHandler(pgPool, logger),
    new TvshowGenresSeedDataHandler(pgPool, logger),
  ];
  for (const handler of handlers) {
    await handler.seed();
  }
};
