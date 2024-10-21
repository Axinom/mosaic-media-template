import {
  DEFAULT_SYSTEM_USERNAME,
  MOSAIC_AUTH_SUBJECT_NAME,
  OwnerPgPool,
  transactionWithContext,
} from '@axinom/mosaic-db-common';
import { Logger, MosaicErrors } from '@axinom/mosaic-service-common';
import { all, count, insert, IsolationLevel } from 'zapatos/db';
import { tvshow_genres } from 'zapatos/schema';
import { getMediaMappedError } from '../../../common';

export class TvshowGenresSeedDataHandler {
  private readonly defaultTvGenres: tvshow_genres.Insertable[] = [
    { title: 'Drama', sort_order: 1 },
    { title: 'Comedy', sort_order: 2 },
    { title: 'Crime', sort_order: 3 },
    { title: 'Mystery', sort_order: 4 },
    { title: 'Thriller', sort_order: 5 },
    { title: 'Sci-Fi', sort_order: 6 },
    { title: 'Fantasy', sort_order: 7 },
    { title: 'Horror', sort_order: 8 },
    { title: 'Action', sort_order: 9 },
    { title: 'Romance', sort_order: 10 },
    { title: 'Animation', sort_order: 11 },
    { title: 'Family', sort_order: 12 },
    { title: 'History', sort_order: 13 },
  ];

  constructor(
    private readonly ownerPool: OwnerPgPool,
    private readonly logger: Logger,
  ) {}

  public async seed(): Promise<void> {
    try {
      await transactionWithContext(
        this.ownerPool,
        IsolationLevel.Serializable,
        { [MOSAIC_AUTH_SUBJECT_NAME]: DEFAULT_SYSTEM_USERNAME },
        async (ctx) => {
          const tvGenresCount = await count('tvshow_genres', all).run(ctx);
          if (tvGenresCount === 0) {
            await insert('tvshow_genres', this.defaultTvGenres).run(ctx);
          }
        },
      );

      this.logger.debug('Seeding of default tvshow genres have succeeded.');
    } catch (error) {
      throw getMediaMappedError(error, {
        message: 'Seeding of tvshow default genres have failed.',
        code: MosaicErrors.StartupError.code,
      });
    }
  }
}
