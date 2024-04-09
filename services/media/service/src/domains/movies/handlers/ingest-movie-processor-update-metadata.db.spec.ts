import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  createOffsetDate,
  dateToBeInRange,
  difference,
  rejectionOf,
} from '@axinom/mosaic-service-common';
import 'jest-extended';
import { MediaEntityType, UpdateMetadataCommand } from 'media-messages';
import { all, conditions as c, insert, select, update } from 'zapatos/db';
import { ColumnForTable, movies, movies_images } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestMovieProcessor } from './ingest-movie-processor';

describe('IngestMovieProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestMovieProcessor;
  let movie1: movies.JSONSelectable;
  let user: AuthenticatedManagementSubject;
  let timestampBeforeTest: Date;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestMovieProcessor(ctx.config);
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    timestampBeforeTest = createOffsetDate(-20);
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('movie_genres');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  const createMessageBody = (
    element: { id: number; external_id: string | null },
    data: Record<string, unknown>,
    type: MediaEntityType = 'MOVIE',
  ): UpdateMetadataCommand => {
    return {
      entity_id: element.id,
      item: {
        external_id: element.external_id as string,
        type,
        data,
      },
    };
  };

  describe('updateMetadata', () => {
    it.each([undefined, 1])(
      'message with missing regular properties -> original values are retained',
      async (ingestItemId) => {
        // Arrange
        const spy = jest.spyOn<any, any>(processor, 'clearIngestCorrelationId');
        const body = createMessageBody(movie1, {
          title: 'Entity1',
        });
        const selectColumns: ColumnForTable<'movies'>[] = [
          'title',
          'original_title',
          'synopsis',
          'description',
          'studio',
          'released',
          'ingest_correlation_id',
        ];
        const updatedMovies = await update(
          'movies',
          {
            original_title: 'Test Title',
            synopsis: 'Test Synopsis',
            description: 'Test Description',
            studio: 'Test Studio',
            released: '2009-12-11',
            ingest_correlation_id: null,
          },
          { id: movie1.id },
          { returning: selectColumns },
        ).run(ctx.ownerPool);

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx, ingestItemId);
        });

        // Assert
        const movies = await select('movies', all, {
          columns: selectColumns,
        }).run(ctx.ownerPool);
        expect(movies).toEqual(updatedMovies);
        expect(spy).toHaveBeenCalledWith(
          'movies',
          ingestItemId,
          body.entity_id,
          expect.any(Object),
        );
      },
    );

    it.each([
      {
        title: 'Entity1',
        original_title: null,
        synopsis: null,
        description: null,
        studio: null,
        released: null,
      },
      {
        title: 'Entity1',
        original_title: '',
        synopsis: '',
        description: '',
        studio: '',
        released: null, //Unlike for strings, there is no 'empty/default' value for date types. Therefore we just set it to null to make the test pass.
      },
    ])(
      'message with null or empty regular properties -> original values are updated with null or empty values',
      async (data) => {
        // Arrange
        const body = createMessageBody(movie1, data);
        const selectColumns: ColumnForTable<'movies'>[] = [
          'title',
          'original_title',
          'synopsis',
          'description',
          'studio',
          'released',
        ];
        await update(
          'movies',
          {
            original_title: 'Test Title',
            synopsis: 'Test Synopsis',
            description: 'Test Description',
            studio: 'Test Studio',
            released: '2009-12-11',
          },
          { id: movie1.id },
          { returning: selectColumns },
        ).run(ctx.ownerPool);

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const movies = await select('movies', all, {
          columns: selectColumns,
        }).run(ctx.ownerPool);
        expect(movies).toEqual([data]);
      },
    );

    it('message with named relations -> valid data', async () => {
      // Arrange
      const data = {
        title: 'Movie1',
        description: 'Movie1 description',
        tags: ['Tag1', 'Tag2'],
        cast: ['Actor1', 'Actress1', 'Actress2'],
        production_countries: ['FR', 'FO', 'FM', 'GA'],
        licenses: [
          {
            start: '2020-08-01T00:00:00.000+00:00',
            end: '2020-08-30T23:59:59.999+00:00',
            countries: ['AW', 'AT', 'FI'],
          },
          {
            start: '2020-08-01T00:00:00.000+00:00',
            countries: ['EE', 'DE', 'CO', 'US', 'ES'],
          },
          {
            end: '2020-08-30T23:59:59.999+00:00',
            countries: ['EE', 'DE', 'CO', 'US', 'ES'],
          },
          {
            start: '2020-08-01T00:00:00.000+00:00',
            end: '2020-08-30T23:59:59.999+00:00',
          },
          {
            end: '2020-08-30T23:59:59.999+00:00',
          },
          {
            start: '2020-08-01T00:00:00.000+00:00',
          },
          {
            countries: ['EE', 'DE', 'CO', 'US', 'ES'],
          },
        ],
      };
      const body = createMessageBody(movie1, data);

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) => {
        await processor.updateMetadata(body, dbCtx);
      });

      // Assert
      const movies = await select('movies', all).run(ctx.ownerPool);
      const tags = await select('movies_tags', { movie_id: movie1.id }).run(
        ctx.ownerPool,
      );
      const cast = await select('movies_casts', { movie_id: movie1.id }).run(
        ctx.ownerPool,
      );
      const countries = await select('movies_production_countries', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);
      const licenses = await select('movies_licenses', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);
      const licenseCountries = await select('movies_licenses_countries', {
        movies_license_id: c.isIn(licenses.map((x) => x.id)),
      }).run(ctx.ownerPool);

      expect(movies).toHaveLength(1);

      expect(movies[0].title).toEqual(data.title);
      expect(movies[0].title).not.toEqual(movie1.title);

      expect(movies[0].description).toEqual(data.description);
      expect(movies[0].description).not.toEqual(movie1.description);

      dateToBeInRange(movies[0].updated_date, timestampBeforeTest);
      expect(movies[0].updated_date).not.toEqual(movie1.updated_date);

      expect(movies[0].updated_user).toEqual(DEFAULT_SYSTEM_USERNAME);
      expect(movies[0].updated_user).not.toEqual(movie1.updated_user);

      expect(tags).toHaveLength(2);
      expect(cast).toHaveLength(3);
      expect(countries).toHaveLength(4);
      expect(licenses).toHaveLength(7);
      expect(licenseCountries).toHaveLength(18);
    });

    it('ingesting metadata with non-existent genre -> error', async () => {
      // Arrange
      const body = createMessageBody(movie1, {
        title: movie1.title,
        genres: ['Non-existent'],
      });

      // Act
      const error = await rejectionOf(
        ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        }),
      );

      // Assert
      expect(error.message).toBe(
        'Metadata update has failed because following genres do not exist: Non-existent',
      );

      const genres = await select('movie_genres', all).run(ctx.ownerPool);
      const relatedGenres = await select('movies_movie_genres', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);

      expect(genres).toHaveLength(0);
      expect(relatedGenres).toHaveLength(0);
    });

    it('ingesting metadata with one existing and 2 non-existent genre -> error with correct genres in message', async () => {
      // Arrange
      await insert('movie_genres', {
        title: 'Existing',
        sort_order: 1,
      }).run(ctx.ownerPool);

      const body = createMessageBody(movie1, {
        title: movie1.title,
        genres: ['Existing', 'Non-existent1', 'Non-existent2'],
      });

      // Act
      const error = await rejectionOf(
        ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        }),
      );

      // Assert
      expect(error.message).toBe(
        'Metadata update has failed because following genres do not exist: Non-existent1, Non-existent2',
      );

      const genres = await select('movie_genres', all).run(ctx.ownerPool);
      const relatedGenres = await select('movies_movie_genres', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);

      expect(genres).toHaveLength(1);
      expect(relatedGenres).toHaveLength(0);
    });

    it.each`
      mainVideoValue | trailersValue
      ${{}}          | ${[]}
      ${null}        | ${null}
    `(
      'message with video value "$mainVideoValue" and trailers value "$trailersValue" -> video assignments are cleared',
      async ({ mainVideoValue, trailersValue }) => {
        // Arrange
        const [elementWithVideo] = await update(
          'movies',
          { main_video_id: 'e6913dba-3091-4b3a-9c33-d0112bb2ef32' },
          { id: movie1.id },
        ).run(ctx.ownerPool);

        const trailersBefore = await insert('movies_trailers', [
          {
            video_id: '617f99ed-321b-4da3-9758-fbe6231ae519',
            movie_id: movie1.id,
          },
          {
            video_id: 'aadbe276-5b2b-45f1-9d41-3289465e186c',
            movie_id: movie1.id,
          },
        ]).run(ctx.ownerPool);

        const data = {
          title: 'Element1',
          index: 1,
          main_video: mainVideoValue,
          trailers: trailersValue,
        };
        const body = createMessageBody(movie1, data);

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const elements = await select('movies', all, {
          columns: ['main_video_id'],
        }).run(ctx.ownerPool);
        const trailers = await select('movies_trailers', {
          movie_id: movie1.id,
        }).run(ctx.ownerPool);

        expect(elements).toHaveLength(1);
        expect(trailers).toHaveLength(0);
        expect(trailersBefore).toHaveLength(2);

        expect(elements[0].main_video_id).toBeNull();
        expect(elements[0].main_video_id).not.toEqual(
          elementWithVideo.main_video_id,
        );
      },
    );

    it('message with undefined video assignment -> video assignment is retained', async () => {
      // Arrange
      const [elementWithVideo] = await update(
        'movies',
        { main_video_id: '2efdc8d6-8709-4958-85ab-a8dad3e03056' },
        { id: movie1.id },
      ).run(ctx.ownerPool);

      const data = {
        title: 'Element1',
        index: 1,
        main_video: undefined,
      };
      const body = createMessageBody(movie1, data);

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) => {
        await processor.updateMetadata(body, dbCtx);
      });

      // Assert
      const elements = await select(
        'movies',
        { id: movie1.id },
        { columns: ['main_video_id'] },
      ).run(ctx.ownerPool);

      expect(elements).toHaveLength(1);

      expect(elements[0].main_video_id).not.toBeNull();
      expect(elements[0].main_video_id).toEqual(elementWithVideo.main_video_id);
    });

    it('message with undefined trailers value -> trailer assignments are retained', async () => {
      // Arrange
      const trailersBefore = await insert('movies_trailers', [
        {
          video_id: '6f61de36-db00-4cbc-8184-1426e801fd83',
          movie_id: movie1.id,
        },
        {
          video_id: '4b3a63eb-71a6-48ba-a9f5-9b57b90b5ed7',
          movie_id: movie1.id,
        },
      ]).run(ctx.ownerPool);

      const data = {
        title: 'Element1',
        index: 1,
        trailers: undefined,
      };
      const body = createMessageBody(movie1, data);

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) => {
        await processor.updateMetadata(body, dbCtx);
      });

      // Assert
      const elements = await select('movies', all, { columns: ['id'] }).run(
        ctx.ownerPool,
      );
      const trailers = await select('movies_trailers', {
        movie_id: movie1.id,
      }).run(ctx.ownerPool);

      expect(elements).toHaveLength(1);
      expect(trailers).toHaveLength(2);
      expect(trailersBefore).toEqual(trailers);
    });

    // Only unassignment of image relations is happening in UpdateMetadataHandler
    // If we send empty array - we want to unassign all relations
    // If we send something - we want to unassign existing image relations of types, that are not specified in ingest item
    // If we send null - relations should remain unchanged
    it.each`
      existingTypes          | sentTypes              | expectedTypes
      ${[]}                  | ${[]}                  | ${[]}
      ${[]}                  | ${['COVER']}           | ${[]}
      ${[]}                  | ${['COVER', 'TEASER']} | ${[]}
      ${['COVER']}           | ${[]}                  | ${[]}
      ${['COVER']}           | ${['COVER']}           | ${['COVER']}
      ${['COVER']}           | ${['COVER', 'TEASER']} | ${['COVER']}
      ${['COVER', 'TEASER']} | ${[]}                  | ${[]}
      ${['COVER', 'TEASER']} | ${['COVER']}           | ${['COVER']}
      ${['COVER', 'TEASER']} | ${['COVER', 'TEASER']} | ${['COVER', 'TEASER']}
      ${['COVER', 'TEASER']} | ${null}                | ${['COVER', 'TEASER']}
    `(
      'message with with images of types $sentTypes for movie with existing image types $existingTypes -> relations are either cleared or kept, expected $expectedTypes',
      async ({ existingTypes, sentTypes, expectedTypes }) => {
        // Arrange
        const insertables: movies_images.Insertable[] = [];
        let idIndex = 1;
        for (const type of existingTypes) {
          insertables.push({
            image_id: `11e1d903-49ed-4d70-8b24-00000000000${idIndex++}`,
            movie_id: movie1.id,
            image_type: type,
          });
        }

        if (insertables.length > 0) {
          await insert('movies_images', insertables).run(ctx.ownerPool);
        }

        const data = {
          title: 'Element1',
          images: sentTypes?.map((type: 'COVER' | 'TEASER') => ({
            path: 'test-images/covers/avatar_1.png',
            type,
          })),
        };
        const body = createMessageBody(movie1, data);

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const elements = await select('movies', all).run(ctx.ownerPool);
        const images = await select('movies_images', {
          movie_id: movie1.id,
        }).run(ctx.ownerPool);

        expect(elements).toHaveLength(1);
        expect(images.map((image) => image.image_type).sort()).toEqual(
          expectedTypes.sort(),
        );
      },
    );

    it.each`
      ingest                                                                | existing              | expected
      ${undefined}                                                          | ${[]}                 | ${[]}
      ${undefined}                                                          | ${['test1']}          | ${['test1']}
      ${undefined}                                                          | ${['test1', 'test2']} | ${['test1', 'test2']}
      ${null}                                                               | ${[]}                 | ${[]}
      ${null}                                                               | ${['test1']}          | ${['test1']}
      ${null}                                                               | ${['test1', 'test2']} | ${['test1', 'test2']}
      ${[]}                                                                 | ${[]}                 | ${[]}
      ${[]}                                                                 | ${['test1']}          | ${[]}
      ${[]}                                                                 | ${['test1', 'test2']} | ${[]}
      ${['test1']}                                                          | ${[]}                 | ${['test1']}
      ${['test1']}                                                          | ${['test1']}          | ${['test1']}
      ${['test1']}                                                          | ${['test1', 'test2']} | ${['test1']}
      ${['test1', 'test2']}                                                 | ${[]}                 | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test1']}          | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test1', 'test2']} | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test3', 'test4']} | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test2', 'test3']} | ${['test1', 'test2']}
      ${['test1', 'Test2']}                                                 | ${['test2', 'test3']} | ${['test1', 'Test2']}
      ${['test1', 'test2']}                                                 | ${['Test2', 'test3']} | ${['test1', 'test2']}
      ${['test1', 'test2', 'test3', 'test4', 'test5']}                      | ${['test4', 'test6']} | ${['test1', 'test2', 'test3', 'test4', 'test5']}
      ${['Value,With,Comma1', 'Value, With, Comma2', 'Value,With, Comma3']} | ${[]}                 | ${['Value,With,Comma1', 'Value, With, Comma2', 'Value,With, Comma3']}
    `(
      'ingesting $ingest relations with already saved $existing relations -> result with $expected relations',
      async ({ ingest, existing, expected }) => {
        // Arrange
        if (existing.length > 0) {
          const array = existing.map((name: string) => ({
            name,
            movie_id: movie1.id,
          }));
          await insert('movies_tags', array).run(ctx.ownerPool);
          await insert('movies_casts', array).run(ctx.ownerPool);
          await insert('movies_production_countries', array).run(ctx.ownerPool);
        }

        const body = createMessageBody(movie1, {
          title: movie1.title,
          tags: ingest,
          cast: ingest,
          production_countries: ingest,
        });

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const tags = await select(
          'movies_tags',
          { movie_id: movie1.id },
          { columns: ['name'] },
        ).run(ctx.ownerPool);

        const cast = await select(
          'movies_casts',
          { movie_id: movie1.id },
          { columns: ['name'] },
        ).run(ctx.ownerPool);

        const countries = await select(
          'movies_production_countries',
          { movie_id: movie1.id },
          { columns: ['name'] },
        ).run(ctx.ownerPool);

        expect(tags.map((t) => t.name)).toIncludeSameMembers(expected);
        expect(cast.map((t) => t.name)).toIncludeSameMembers(expected);
        expect(countries.map((t) => t.name)).toIncludeSameMembers(expected);
      },
    );

    //TODO: Also test input duplicate values
    it.each`
      ingest                                                                | existing              | expected
      ${undefined}                                                          | ${[]}                 | ${[]}
      ${undefined}                                                          | ${['test1']}          | ${['test1']}
      ${undefined}                                                          | ${['test1', 'test2']} | ${['test1', 'test2']}
      ${null}                                                               | ${[]}                 | ${[]}
      ${null}                                                               | ${['test1']}          | ${['test1']}
      ${null}                                                               | ${['test1', 'test2']} | ${['test1', 'test2']}
      ${[]}                                                                 | ${[]}                 | ${[]}
      ${[]}                                                                 | ${['test1']}          | ${[]}
      ${[]}                                                                 | ${['test1', 'test2']} | ${[]}
      ${['test1']}                                                          | ${[]}                 | ${['test1']}
      ${['test1']}                                                          | ${['test1']}          | ${['test1']}
      ${['test1']}                                                          | ${['test1', 'test2']} | ${['test1']}
      ${['test1', 'test2']}                                                 | ${[]}                 | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test1']}          | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test1', 'test2']} | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test3', 'test4']} | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['test2', 'test3']} | ${['test1', 'test2']}
      ${['test1', 'Test2']}                                                 | ${['test2', 'test3']} | ${['test1', 'test2']}
      ${['test1', 'test2']}                                                 | ${['Test2', 'test3']} | ${['test1', 'Test2']}
      ${['test1', 'test2', 'test3', 'test4', 'test5']}                      | ${['test4', 'test6']} | ${['test1', 'test2', 'test3', 'test4', 'test5']}
      ${['Value,With,Comma1', 'Value, With, Comma2', 'Value,With, Comma3']} | ${[]}                 | ${['Value,With,Comma1', 'Value, With, Comma2', 'Value,With, Comma3']}
    `(
      'ingesting $ingest genres with already saved $existing genres -> result with $expected genres',
      async ({ ingest, existing, expected }) => {
        // Arrange
        const allGenres = [...existing];
        if (ingest?.length > 0) {
          allGenres.push(...difference(ingest, existing));
        }

        if (allGenres.length > 0) {
          const genres = allGenres.map((title, index) => ({
            title,
            sort_order: index,
          }));
          const existingGenres = await insert('movie_genres', genres).run(
            ctx.ownerPool,
          );

          const relations = existingGenres
            .filter((genre) => existing.includes(genre.title))
            .map((genre) => ({
              movie_id: movie1.id,
              movie_genres_id: genre.id,
            }));

          if (relations.length > 0) {
            await insert('movies_movie_genres', relations).run(ctx.ownerPool);
          }
        }

        const body = createMessageBody(movie1, {
          title: movie1.title,
          genres: ingest,
        });

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const genres = await select('movie_genres', all).run(ctx.ownerPool);
        const relatedGenres = await select('movies_movie_genres', {
          movie_id: movie1.id,
        }).run(ctx.ownerPool);
        const relatedGenreTitles = genres
          .filter((genre) =>
            relatedGenres.map((g) => g.movie_genres_id).includes(genre.id),
          )
          .map((genre) => genre.title);

        expect(genres.map((t) => t.title)).toIncludeSameMembers(allGenres);
        expect(relatedGenreTitles).toIncludeSameMembers(expected);
      },
    );

    it.each`
      ingest       | existing    | expected
      ${undefined} | ${[]}       | ${[]}
      ${undefined} | ${[{}]}     | ${[{}]}
      ${undefined} | ${[{}, {}]} | ${[{}, {}]}
      ${null}      | ${[]}       | ${[]}
      ${null}      | ${[{}]}     | ${[{}]}
      ${null}      | ${[{}, {}]} | ${[{}, {}]}
      ${[]}        | ${[]}       | ${[]}
      ${[]}        | ${[{}]}     | ${[]}
      ${[]}        | ${[{}, {}]} | ${[]}
      ${[{}]}      | ${[]}       | ${[{}]}
      ${[{}]}      | ${[{}]}     | ${[{}]}
      ${[{}]}      | ${[{}, {}]} | ${[{}]}
      ${[{}, {}]}  | ${[]}       | ${[{}, {}]}
      ${[{}, {}]}  | ${[{}]}     | ${[{}, {}]}
      ${[{}, {}]}  | ${[{}, {}]} | ${[{}, {}]}
    `(
      'ingesting $ingest licenses with already saved $existing licenses -> result with $expected licenses',
      async ({ ingest, existing, expected }) => {
        // Arrange
        if (existing.length > 0) {
          const existingLicenses = existing.map(() => ({
            movie_id: movie1.id,
            license_start: '2020-08-01T00:00:00.000+00:00',
            license_end: '2020-08-30T23:59:59.999+00:00',
          }));
          await insert('movies_licenses', existingLicenses).run(ctx.ownerPool);
        }
        const licenses = !ingest
          ? ingest
          : ingest.map(() => ({
              start: '2020-08-01T00:00:00.000+00:00',
              end: '2020-08-30T23:59:59.999+00:00',
            }));
        const body = createMessageBody(movie1, {
          title: movie1.title,
          licenses,
        });

        // Act
        await ctx.executeOwnerSql(user, async (dbCtx) => {
          await processor.updateMetadata(body, dbCtx);
        });

        // Assert
        const ingestedLicenses = await select('movies_licenses', {
          movie_id: movie1.id,
        }).run(ctx.ownerPool);

        expect(ingestedLicenses).toHaveLength(expected.length);
      },
    );
  });
});
