import {
  assertError,
  Logger,
  randomArray,
} from '@axinom/mosaic-service-common';
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
import { collections } from 'zapatos/schema';
import { getValidatedExtendedContext } from '../../../graphql';
import { insertImages, insertTags, splitCount } from '../../common';

const insertRelations = async (
  ctx: Queryable,
  collectionId: number,
  movieIds: number[],
  tvShowIds: number[],
  seasonIds: number[],
  episodeIds: number[],
): Promise<void> => {
  let sortOrder = 0;
  const movies = randomArray(0, 50, () => {
    return faker.helpers.arrayElement(movieIds);
  }).map((id) => ({
    collection_id: collectionId,
    sort_order: sortOrder++,
    movie_id: id,
  }));

  const tvshows = randomArray(0, 50, () => {
    return faker.helpers.arrayElement(tvShowIds);
  }).map((id) => ({
    collection_id: collectionId,
    sort_order: sortOrder++,
    tvshow_id: id,
  }));

  const seasons = randomArray(0, 50, () => {
    return faker.helpers.arrayElement(seasonIds);
  }).map((id) => ({
    collection_id: collectionId,
    sort_order: sortOrder++,
    season_id: id,
  }));

  const episodes = randomArray(0, 50, () => {
    return faker.helpers.arrayElement(episodeIds);
  }).map((id) => ({
    collection_id: collectionId,
    sort_order: sortOrder++,
    episode_id: id,
  }));

  const relations = [...movies, ...tvshows, ...seasons, ...episodes];
  if (relations.length === 0) {
    return;
  }

  await insert('collection_relations', relations).run(ctx);
};

const generateSampleCollection = (): collections.Insertable => {
  return {
    external_id: faker.datatype.uuid(),
    title: faker.random.words().trim() || 'The Matrix',
    synopsis: faker.lorem.paragraph(1),
    description: faker.lorem.paragraph(5),
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
 * Plugin that adds a custom graphql endpoint `populateCollections` which populates collections and collection relations with mock data.
 * Uses existing movies, tvshows, seasons and episodes to populate manual relations.
 *
 * @param additionalGraphQLContextFromRequest should be of type `Record<string, any> & { ownerPool: Pool}`
 */
export const PopulateEndpointPlugin = makeExtendSchemaPlugin((build) => {
  const logger = new Logger({ context: 'populate-collections' });
  return {
    typeDefs: gqlExtended`
        extend type Mutation {
          populateCollections(input: PopulateInput!): PopulatePayload
        }
      `,
    resolvers: {
      Mutation: {
        populateCollections: async (_query, args, context) => {
          const { ownerPool } = getValidatedExtendedContext(context);
          const movieIds = (
            await select('movies', all, { columns: ['id'] }).run(ownerPool)
          ).map((r) => r.id);
          const tvshowIds = (
            await select('tvshows', all, { columns: ['id'] }).run(ownerPool)
          ).map((r) => r.id);
          const seasonIds = (
            await select('seasons', all, { columns: ['id'] }).run(ownerPool)
          ).map((r) => r.id);
          const episodeIds = (
            await select('episodes', all, { columns: ['id'] }).run(ownerPool)
          ).map((r) => r.id);

          let count = 0;
          const batches = splitCount(args.input.count);
          for await (const batch of batches) {
            try {
              const elements: collections.Insertable[] = [];
              for (let i = 0; i < batch; i++) {
                elements.push(generateSampleCollection());
              }
              await transaction(
                ownerPool,
                IsolationLevel.Serializable,
                async (ctx) => {
                  const collections = await insert('collections', elements).run(
                    ctx,
                  );

                  for (const collection of collections) {
                    await insertTags(ctx, collection.id, 'collection');
                    await insertImages(ctx, collection.id, 'collection');
                    await insertRelations(
                      ctx,
                      collection.id,
                      movieIds,
                      tvshowIds,
                      seasonIds,
                      episodeIds,
                    );
                  }
                },
              );
              count += elements.length;
            } catch (error) {
              assertError(error);
              logger.warn(
                error,
                `An error occurred trying to insert a batch of ${batch} sample collections.`,
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
