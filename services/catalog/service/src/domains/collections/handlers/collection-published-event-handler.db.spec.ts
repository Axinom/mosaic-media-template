import 'jest-extended';
import { insert, select, selectOne } from 'zapatos/db';
import { collection } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  createCollectionPublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { CollectionPublishedEventHandler } from './collection-published-event-handler';

describe('CollectionPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: CollectionPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new CollectionPublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('collection');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('A new collection is published', async () => {
      // Arrange
      const message = createCollectionPublishedMessage('collection-1');
      const payload = message.payload;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const collection = await selectOne('collection', {
        id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(collection).toEqual<collection.JSONSelectable>({
        id: payload.content_id,
        tags: payload.tags ?? null,
      });

      const images = await select('collection_images', {
        collection_id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(images).toMatchObject(payload.images!);

      const itemRelations = await select(
        'collection_items_relation',
        { collection_id: payload.content_id },
        { order: { by: 'order_no', direction: 'ASC' } },
      ).run(ctx.ownerPool);
      expect(itemRelations).toMatchObject([
        {
          collection_id: payload.content_id,
          movie_id: 'movie-1',
          order_no: 1,
          relation_type: 'MOVIE',
        },
        {
          collection_id: payload.content_id,
          order_no: 2,
          relation_type: 'TVSHOW',
          tvshow_id: 'tvshow-1',
        },
        {
          collection_id: payload.content_id,
          order_no: 3,
          relation_type: 'SEASON',
          season_id: 'season-1',
        },
        {
          collection_id: payload.content_id,
          episode_id: 'episode-1',
          order_no: 4,
          relation_type: 'EPISODE',
        },
      ]);

      const localizations = await select(
        'collection_localizations',
        { collection_id: payload.content_id },
        {
          columns: [
            'title',
            'description',
            'synopsis',
            'locale',
            'is_default_locale',
          ],
        },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        payload.localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });

    test('An existing collection is republished', async () => {
      // Arrange
      await insert('collection', {
        id: 'collection-1',
        tags: ['Old Tag 1', 'Old Tag 2'],
      }).run(ctx.ownerPool);
      await insert('collection_localizations', {
        collection_id: 'collection-1',
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      const message = createCollectionPublishedMessage('collection-1');
      const payload = message.payload;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const collection = await selectOne('collection', {
        id: payload.content_id,
      }).run(ctx.ownerPool);

      expect(collection?.tags).toEqual(payload.tags);
      const localizations = await select(
        'collection_localizations',
        { collection_id: 'collection-1' },
        {
          columns: [
            'title',
            'description',
            'synopsis',
            'locale',
            'is_default_locale',
          ],
        },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeSameMembers(
        payload.localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });
  });
});
