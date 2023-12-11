import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { VideoMessageContext } from 'media-messages';
import { all, insert, select, selectExactlyOne, update } from 'zapatos/db';
import { ingest_items, movies } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { IngestMovieProcessor } from './ingest-movie-processor';

describe('IngestMovieProcessor', () => {
  let ctx: ITestContext;
  let processor: IngestMovieProcessor;
  let item1: ingest_items.JSONSelectable;
  let movie1: movies.JSONSelectable;
  let user: AuthenticatedManagementSubject;

  beforeAll(async () => {
    ctx = await createTestContext();
    processor = new IngestMovieProcessor(ctx.config);
    user = createTestUser(ctx.config.serviceId);
  });

  beforeEach(async () => {
    const doc1 = await insert('ingest_documents', {
      name: 'test1',
      title: 'test1',
      document: {
        name: 'test1',
        document_created: '2020-08-04T08:57:40.763+00:00',
        items: [],
      },
      items_count: 0,
    }).run(ctx.ownerPool);
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
    item1 = await insert('ingest_items', {
      ingest_document_id: doc1.id,
      external_id: 'externalId',
      entity_id: movie1.id,
      type: 'MOVIE',
      exists_status: 'CREATED',
      display_title: 'title',
      item: {
        type: 'MOVIE',
        external_id: 'externalId',
        data: {
          title: 'title',
          trailers: [{ source: 'test', profile: 'DEFAULT' }],
        },
      },
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    await ctx.truncate('movies');
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('processVideo', () => {
    // When we ingest trailers, for a single entity (movie) - we are waiting for all trailer ids to be received and only after that updating relations, otherwise we don't know which previously assigned trailers to unassign and which to keep.
    // This tests sends a message that a video with id "1" is processed.
    // If it's the last processed trailer - relations are updated.
    // If it's not the last - relations remain the same and only processed_trailer_ids property of ingest item is updated, so that we preserve the context of already processed trailers for future messages to use.
    it.each`
      allTrailersToIngest | alreadyIngestedTrailerIds                   | assignedTrailerIdsBeforeIngest                                                                                              | expectedAssignedTrailerIdsAfterMessage
      ${['t1']}           | ${[]}                                       | ${[]}                                                                                                                       | ${['ae791714-a06c-4a49-a4ff-cac875d064ba']}
      ${['t1']}           | ${[]}                                       | ${['ae791714-a06c-4a49-a4ff-cac875d064ba']}                                                                                 | ${['ae791714-a06c-4a49-a4ff-cac875d064ba']}
      ${['t1']}           | ${[]}                                       | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006', 'a4fc0c3c-0565-4a1c-b6ec-d3295f7405e4']} | ${['ae791714-a06c-4a49-a4ff-cac875d064ba']}
      ${['t1', 't2']}     | ${[]}                                       | ${[]}                                                                                                                       | ${[]}
      ${['t1', 't2']}     | ${[]}                                       | ${['ae791714-a06c-4a49-a4ff-cac875d064ba']}                                                                                 | ${['ae791714-a06c-4a49-a4ff-cac875d064ba']}
      ${['t1', 't2']}     | ${[]}                                       | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006']}                                         | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006']}
      ${['t1', 't2']}     | ${[]}                                       | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006', 'a4fc0c3c-0565-4a1c-b6ec-d3295f7405e4']} | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006', 'a4fc0c3c-0565-4a1c-b6ec-d3295f7405e4']}
      ${['t1', 't2']}     | ${['afd8f6d0-616b-11eb-ae94-0446ac140006']} | ${[]}                                                                                                                       | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006']}
      ${['t1', 't2']}     | ${['afd8f6d0-616b-11eb-ae94-0446ac140006']} | ${['ae791714-a06c-4a49-a4ff-cac875d064ba']}                                                                                 | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006']}
      ${['t1', 't2']}     | ${['afd8f6d0-616b-11eb-ae94-0446ac140006']} | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006']}                                         | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006']}
      ${['t1', 't2']}     | ${['afd8f6d0-616b-11eb-ae94-0446ac140006']} | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006', 'a4fc0c3c-0565-4a1c-b6ec-d3295f7405e4']} | ${['ae791714-a06c-4a49-a4ff-cac875d064ba', 'afd8f6d0-616b-11eb-ae94-0446ac140006']}
    `(
      'updating trailers relations with id "1", allTrailersToIngest: $allTrailersToIngest, alreadyIngestedTrailerIds: $alreadyIngestedTrailerIds, assignedTrailerIdsBeforeIngest: "$assignedTrailerIdsBeforeIngest" -> resulting assigned videoIds: $expectedAssignedTrailerIdsAfterMessage',
      async ({
        allTrailersToIngest,
        alreadyIngestedTrailerIds,
        assignedTrailerIdsBeforeIngest,
        expectedAssignedTrailerIdsAfterMessage,
      }: {
        allTrailersToIngest: string[];
        alreadyIngestedTrailerIds: string[];
        assignedTrailerIdsBeforeIngest: string[];
        expectedAssignedTrailerIdsAfterMessage: string[];
      }) => {
        // Arrange
        const newId = 'ae791714-a06c-4a49-a4ff-cac875d064ba';
        await update(
          'ingest_items',
          {
            processed_trailer_ids: alreadyIngestedTrailerIds,
            item: {
              type: 'MOVIE',
              external_id: 'externalId',
              data: {
                title: 'title',
                trailers: allTrailersToIngest.map((trailer) => ({
                  source: trailer,
                  profile: 'DEFAULT',
                })),
              },
            },
          },
          { id: item1.id },
        ).run(ctx.ownerPool);

        if (assignedTrailerIdsBeforeIngest.length > 0) {
          const assignments = assignedTrailerIdsBeforeIngest.map((id) => ({
            video_id: id,
            movie_id: movie1.id,
          }));
          await insert('movies_trailers', assignments).run(ctx.ownerPool);
        }

        const messageContext: VideoMessageContext = {
          ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
          ingestItemId: item1.id,
          videoType: 'TRAILER',
        };

        // Act
        await ctx.executeGqlSql(user, async (dbCtx) => {
          await processor.processVideo(movie1.id, newId, messageContext, dbCtx);
        });

        // Assert
        const trailers = await select('movies_trailers', {
          movie_id: movie1.id,
        }).run(ctx.ownerPool);
        const ingestItem = await selectExactlyOne('ingest_items', {
          id: item1.id,
        }).run(ctx.ownerPool);

        const resultingIds = trailers.map((trailer) => trailer.video_id).sort();
        const expectedSortedIds = expectedAssignedTrailerIdsAfterMessage.sort();

        expect(resultingIds).toEqual(expectedSortedIds);

        expect(ingestItem.processed_trailer_ids.sort()).toEqual(
          [...alreadyIngestedTrailerIds, newId].sort(),
        );
      },
    );

    it.each`
      oldId                                     | newId
      ${null}                                   | ${'f4278d35-c50b-4e92-810a-f03020f86865'}
      ${'f4278d35-c50b-4e92-810a-f03020f86865'} | ${'f4278d35-c50b-4e92-810a-f03020f86865'}
      ${'f4278d35-c50b-4e92-810a-f03020f86865'} | ${'1c356a03-930e-4082-aa13-4890971c81ab'}
    `(
      'updating from main_video_id value "$oldId" to new value "$newId" -> new value is set',
      async ({ oldId, newId }) => {
        // Arrange
        const [movieBefore] = await update(
          'movies',
          { main_video_id: oldId },
          { id: movie1.id },
        ).run(ctx.ownerPool);

        const messageContext: VideoMessageContext = {
          ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
          ingestItemId: item1.id,
          videoType: 'MAIN',
        };

        // Act
        await ctx.executeGqlSql(user, async (dbCtx) => {
          await processor.processVideo(movie1.id, newId, messageContext, dbCtx);
        });

        // Assert
        const movies = await select('movies', all).run(ctx.ownerPool);

        expect(movies).toHaveLength(1);

        expect(movies[0].main_video_id).toEqual(newId);
        expect(movieBefore.main_video_id).toEqual(oldId);
      },
    );
  });
});
