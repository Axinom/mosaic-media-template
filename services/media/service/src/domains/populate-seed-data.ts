import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../common';
import {
  LOCALIZATION_MOVIE_GENRE_TYPE,
  MovieGenresSeedDataHandler,
} from './movies';
import {
  LOCALIZATION_TVSHOW_GENRE_TYPE,
  TvshowGenresSeedDataHandler,
} from './tvshows';

export const populateSeedData = async (
  pgPool: OwnerPgPool,
  config: Config,
  logger: Logger = new Logger({ context: `populateSeedData` }),
): Promise<void> => {
  if (config.isLocalizationEnabled) {
    logger.debug(
      'Seed data population postponed until localization entity definitions are fully synchronized.',
    );
    return;
  }
  const populate = getPopulateSeedDataCallback(pgPool, logger);
  const types = [LOCALIZATION_MOVIE_GENRE_TYPE, LOCALIZATION_TVSHOW_GENRE_TYPE];
  for (const type of types) {
    await populate(type);
  }
};

export const getPopulateSeedDataCallback =
  (
    pgPool: OwnerPgPool,
    logger: Logger = new Logger({ context: `getPopulateSeedDataCallback` }),
  ) =>
  async (entityType: string): Promise<void> => {
    switch (entityType) {
      case LOCALIZATION_MOVIE_GENRE_TYPE:
        await new MovieGenresSeedDataHandler(pgPool, logger).seed();
        break;
      case LOCALIZATION_TVSHOW_GENRE_TYPE:
        await new TvshowGenresSeedDataHandler(pgPool, logger).seed();
        break;
    }
  };
