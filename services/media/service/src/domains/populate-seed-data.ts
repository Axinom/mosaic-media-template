import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Logger } from '@axinom/mosaic-service-common';
import { MovieGenresSeedDataHandler } from './movies';
import { TvshowGenresSeedDataHandler } from './tvshows';

export const populateSeedData = async (
  pgPool: OwnerPgPool,
  logger: Logger = new Logger({ context: `populateSeedData` }),
): Promise<void> => {
  const handlers = [
    new MovieGenresSeedDataHandler(pgPool, logger),
    new TvshowGenresSeedDataHandler(pgPool, logger),
  ];
  for (const handler of handlers) {
    await handler.seed();
  }
};
