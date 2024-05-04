import { assertError, Logger } from '@axinom/mosaic-service-common';
import { faker } from '@faker-js/faker';
import { gql as gqlExtended, makeExtendSchemaPlugin } from 'graphile-utils';
import { PublishStatusEnum } from 'zapatos/custom';
import { all, insert, IsolationLevel, select, transaction } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import { getValidatedExtendedContext } from '../../../graphql';
import {
  insertCasts,
  insertGenres,
  insertImages,
  insertLicenses,
  insertProductionCountries,
  insertTags,
  insertTrailers,
  seedGenres,
  splitCount,
} from '../../common';

const generateSampleMovie = (): movies.Insertable => {
  return {
    external_id: faker.datatype.uuid(),
    title: faker.random.words().trim() || 'The Matrix',
    original_title: faker.random.words().trim() || 'The Matrix',
    synopsis: faker.lorem.paragraph(1),
    description: faker.lorem.paragraph(5),
    studio: faker.company.name(),
    released: faker.date.past(),
    main_video_id: faker.datatype.uuid(),
    publish_status: faker.helpers.arrayElement<PublishStatusEnum>([
      'NOT_PUBLISHED',
      'PUBLISHED',
    ]),
    published_user: faker.helpers.fake('{{name.lastName}}, {{name.firstName}}'),
    published_date: faker.date.recent(),
    created_user: faker.helpers.fake('{{name.lastName}}, {{name.firstName}}'),
    updated_user: faker.helpers.fake('{{name.lastName}}, {{name.firstName}}'),
    created_date: faker.date.recent(),
    updated_date: faker.date.recent(),
  };
};

/**
 * Plugin that adds a custom graphql endpoint `populateMovies` which populates movies and movie relations with mock data, except for collection relations.
 * Database is seeded with default movie_genres if no genres exist.
 *
 * @param additionalGraphQLContextFromRequest should be of type `Record<string, any> & { ownerPool: Pool}`
 */
export const PopulateEndpointPlugin = makeExtendSchemaPlugin((build) => {
  const logger = new Logger({ context: 'populate-movies' });
  return {
    typeDefs: gqlExtended`
      input PopulateInput {
        clientMutationId: String
        count: Int!
      }
      type PopulatePayload {
        count: Int!
        query: Query
      }
      extend type Mutation {
        populateMovies(input: PopulateInput!): PopulatePayload
      }
    `,
    resolvers: {
      Mutation: {
        populateMovies: async (_query, args, context) => {
          const { ownerPool } = getValidatedExtendedContext(context);
          const genreIdsResult = await select('movie_genres', all, {
            columns: ['id'],
          }).run(ownerPool);

          let genreIds = genreIdsResult.map((r) => r.id);
          if (genreIdsResult.length === 0) {
            genreIds = await seedGenres(ownerPool, 'movie_genres');
          }

          let count = 0;
          const batches = splitCount(args.input.count);
          for await (const batch of batches) {
            try {
              const elements: movies.Insertable[] = [];
              for (let i = 0; i < batch; i++) {
                elements.push(generateSampleMovie());
              }
              await transaction(
                ownerPool,
                IsolationLevel.Serializable,
                async (ctx) => {
                  const movies = await insert('movies', elements).run(ctx);

                  for (const movie of movies) {
                    await insertTrailers(ctx, movie.id, 'movie');
                    await insertTags(ctx, movie.id, 'movie');
                    await insertProductionCountries(ctx, movie.id, 'movie');
                    await insertImages(ctx, movie.id, 'movie');
                    await insertCasts(ctx, movie.id, 'movie');
                    await insertLicenses(ctx, movie.id, 'movie');
                    await insertGenres(
                      ctx,
                      movie.id,
                      genreIds,
                      'movie',
                      'movie',
                    );
                  }
                },
              );
              count += elements.length;
            } catch (error) {
              assertError(error);
              logger.warn(
                error,
                `An error occurred trying to insert a batch of ${batch} sample movies.`,
              );
            }
          }
          return {
            count,
            query: build.$$isQuery,
          };
        },
      },
    },
  };
});
