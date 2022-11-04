import { insert, select, selectOne } from 'zapatos/db';
import { collection } from 'zapatos/schema';
import {
  createCollectionPublishedEvent,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { CollectionPublishedEventHandler } from './collection-published-event-handler';

describe('CollectionPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: CollectionPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new CollectionPublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('collection');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new collection is published', async () => {
      // Arrange
      const message = createCollectionPublishedEvent('collection-1');

      // Act
      await handler.onMessage(message);

      // TODO: Consider verifying via the GQL API.
      // Assert
      const collection = await selectOne('collection', {
        id: message.content_id,
      }).run(ctx.ownerPool);
      expect(collection).toEqual<collection.JSONSelectable>({
        id: message.content_id,
        title: message.title ?? null,
        description: message.description ?? null,
        synopsis: message.synopsis ?? null,
        tags: message.tags ?? null,
      });

      const images = await select('collection_images', {
        collection_id: message.content_id,
      }).run(ctx.ownerPool);
      expect(images).toMatchObject(message.images!);

      const itemRelations = await select(
        'collection_items_relation',
        { collection_id: message.content_id },
        { order: { by: 'order_no', direction: 'ASC' } },
      ).run(ctx.ownerPool);
      expect(itemRelations).toMatchObject([
        {
          collection_id: message.content_id,
          movie_id: 'movie-1',
          order_no: 1,
          relation_type: 'MOVIE',
        },
        {
          collection_id: message.content_id,
          order_no: 2,
          relation_type: 'TVSHOW',
          tvshow_id: 'tvshow-1',
        },
        {
          collection_id: message.content_id,
          order_no: 3,
          relation_type: 'SEASON',
          season_id: 'season-1',
        },
        {
          collection_id: message.content_id,
          episode_id: 'episode-1',
          order_no: 4,
          relation_type: 'EPISODE',
        },
      ]);
    });

    test('An existing collection is republished', async () => {
      // Arrange
      await insert('collection', {
        id: 'collection-1',
        title: 'Old title',
      }).run(ctx.ownerPool);
      const message = createCollectionPublishedEvent('collection-1');
      message.title = 'New title';

      // Act
      await handler.onMessage(message);

      // Assert
      const collection = await selectOne('collection', {
        id: message.content_id,
      }).run(ctx.ownerPool);

      expect(collection?.title).toEqual('New title');
    });
  });
});
