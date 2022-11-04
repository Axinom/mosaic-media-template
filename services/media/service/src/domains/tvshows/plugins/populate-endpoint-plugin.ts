import { assertError, Logger } from '@axinom/mosaic-service-common';
import { faker } from '@faker-js/faker';
import { gql as gqlExtended, makeExtendSchemaPlugin } from 'graphile-utils';
import { PublishStatusEnum } from 'zapatos/custom';
import {
  all,
  insert,
  IsolationLevel,
  Queryable,
  select,
  transaction,
} from 'zapatos/db';
import { episodes, seasons, tvshows } from 'zapatos/schema';
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

const generateSampleTvShow = (): tvshows.Insertable => {
  return {
    external_id: faker.datatype.uuid(),
    title: faker.random.words().trim() || 'The Matrix',
    original_title: faker.random.words().trim() || 'The Matrix',
    synopsis: faker.lorem.paragraph(1),
    description: faker.lorem.paragraph(5),
    studio: faker.company.name(),
    released: faker.date.past(),
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

const generateSampleSeason = (tvshowId: number): seasons.Insertable => {
  return {
    tvshow_id: tvshowId,
    index: faker.datatype.number({ min: 0, max: 15 }),
    external_id: faker.datatype.uuid(),
    synopsis: faker.lorem.paragraph(1),
    description: faker.lorem.paragraph(5),
    studio: faker.company.name(),
    released: faker.date.past(),
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

const generateSampleEpisode = (seasonId: number): episodes.Insertable => {
  return {
    season_id: seasonId,
    index: faker.datatype.number({ min: 0, max: 15 }),
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

const insertEpisodes = async (
  ctx: Queryable,
  seasonId: number,
  genreIds: number[],
): Promise<void> => {
  const episodesCount = faker.datatype.number({ min: 0, max: 50 });
  if (episodesCount === 0) {
    return;
  }

  const elements = [];
  for (let i = 0; i < episodesCount; i++) {
    elements.push(generateSampleEpisode(seasonId));
  }
  const episodes = await insert('episodes', elements).run(ctx);

  for (const episode of episodes) {
    await insertTrailers(ctx, episode.id, 'episode');
    await insertTags(ctx, episode.id, 'episode');
    await insertProductionCountries(ctx, episode.id, 'episode');
    await insertImages(ctx, episode.id, 'episode');
    await insertCasts(ctx, episode.id, 'episode');
    await insertLicenses(ctx, episode.id, 'episode');
    await insertGenres(ctx, episode.id, genreIds, 'episode', 'tvshow');
  }
};

const insertSeasons = async (
  ctx: Queryable,
  tvshowId: number,
  genreIds: number[],
): Promise<void> => {
  const seasonsCount = faker.datatype.number({ min: 0, max: 15 });
  if (seasonsCount === 0) {
    return;
  }

  const elements = [];
  for (let i = 0; i < seasonsCount; i++) {
    elements.push(generateSampleSeason(tvshowId));
  }

  const seasons = await insert('seasons', elements).run(ctx);

  for (const season of seasons) {
    await insertTrailers(ctx, season.id, 'season');
    await insertTags(ctx, season.id, 'season');
    await insertProductionCountries(ctx, season.id, 'season');
    await insertImages(ctx, season.id, 'season');
    await insertCasts(ctx, season.id, 'season');
    await insertLicenses(ctx, season.id, 'season');
    await insertGenres(ctx, season.id, genreIds, 'season', 'tvshow');
    await insertEpisodes(ctx, season.id, genreIds);
  }
};

/**
 * Plugin that adds a custom graphql endpoint `populateTvshows` which populates tvshows, seasons, episodes and their relations with mock data, except for collection relations.
 * Generates from 0 to 15 seasons for each generated tvshow with all relations, except for collection relation.
 * Generates from 0 to 50 episodes for each generated season with all relations, except for collection relation.
 * Database is seeded with default tvshow_genres if no genres exist.
 *
 * @param additionalGraphQLContextFromRequest should be of type `Record<string, any> & { ownerPool: Pool}`
 */
export const PopulateEndpointPlugin = makeExtendSchemaPlugin((build) => {
  const logger = new Logger({ context: 'populate-tvshows' });
  return {
    typeDefs: gqlExtended`
      extend type Mutation {
        populateTvshows(input: PopulateInput!): PopulatePayload
      }
    `,
    resolvers: {
      Mutation: {
        populateTvshows: async (_query, args, { ownerPool }) => {
          const genreIdsResult = await select('tvshow_genres', all, {
            columns: ['id'],
          }).run(ownerPool);

          let genreIds = genreIdsResult.map((r) => r.id);
          if (genreIdsResult.length === 0) {
            genreIds = await seedGenres(ownerPool, 'tvshow_genres');
          }

          let count = 0;
          const batches = splitCount(args.input.count, 50);
          for await (const batch of batches) {
            try {
              await transaction(
                ownerPool,
                IsolationLevel.Serializable,
                async (ctx) => {
                  const elements = [];
                  for (let i = 0; i < batch; i++) {
                    elements.push(generateSampleTvShow());
                  }

                  const tvshows = await insert('tvshows', elements).run(ctx);

                  for (const tvshow of tvshows) {
                    await insertTrailers(ctx, tvshow.id, 'tvshow');
                    await insertTags(ctx, tvshow.id, 'tvshow');
                    await insertProductionCountries(ctx, tvshow.id, 'tvshow');
                    await insertImages(ctx, tvshow.id, 'tvshow');
                    await insertCasts(ctx, tvshow.id, 'tvshow');
                    await insertLicenses(ctx, tvshow.id, 'tvshow');
                    await insertGenres(
                      ctx,
                      tvshow.id,
                      genreIds,
                      'tvshow',
                      'tvshow',
                    );
                    await insertSeasons(ctx, tvshow.id, genreIds);
                  }

                  count += tvshows.length;
                },
              );
            } catch (error) {
              assertError(error);
              logger.warn(
                error,
                `An error occurred trying to insert a batch of ${batch} sample TV shows.`,
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
