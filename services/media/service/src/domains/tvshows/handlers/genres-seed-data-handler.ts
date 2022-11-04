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
    { title: 'Action', sort_order: 1 },
    { title: 'Adventure', sort_order: 2 },
    { title: 'Animation', sort_order: 3 },
    { title: 'Biography', sort_order: 4 },
    { title: 'Comedy', sort_order: 5 },
    { title: 'Crime', sort_order: 6 },
    { title: 'Documentary', sort_order: 7 },
    { title: 'Drama', sort_order: 8 },
    { title: 'Family', sort_order: 9 },
    { title: 'Fantasy', sort_order: 10 },
    { title: 'Game Show', sort_order: 11 },
    { title: 'History', sort_order: 12 },
    { title: 'Horror', sort_order: 13 },
    { title: 'Music', sort_order: 14 },
    { title: 'Musical', sort_order: 15 },
    { title: 'Mystery', sort_order: 16 },
    { title: 'News', sort_order: 17 },
    { title: 'Reality-TV', sort_order: 18 },
    { title: 'Romance', sort_order: 19 },
    { title: 'Sci-Fi', sort_order: 20 },
    { title: 'Short Film', sort_order: 21 },
    { title: 'Sport', sort_order: 22 },
    { title: 'Superhero', sort_order: 23 },
    { title: 'Talk Show', sort_order: 24 },
    { title: 'Thriller', sort_order: 25 },
    { title: 'War', sort_order: 26 },
    { title: 'Western', sort_order: 27 },
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
