import 'jest-extended';
import { insert, select, selectOne } from 'zapatos/db';
import { collection } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
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

      // Assert
      const collection = await selectOne('collection', {
        id: message.content_id,
      }).run(ctx.ownerPool);
      expect(collection).toEqual<collection.JSONSelectable>({
        id: message.content_id,
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

      const localizations = await select(
        'collection_localizations',
        { collection_id: message.content_id },
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
        message.localizations.map(({ language_tag, ...other }) => ({
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
      const message = createCollectionPublishedEvent('collection-1');

      // Act
      await handler.onMessage(message);

      // Assert
      const collection = await selectOne('collection', {
        id: message.content_id,
      }).run(ctx.ownerPool);

      expect(collection?.tags).toEqual(message.tags);
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
        message.localizations.map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });
  });
});
