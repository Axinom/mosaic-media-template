import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { CollectionUnpublishedEvent } from 'media-messages';
import { all, count, insert, selectOne } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { CollectionUnpublishedEventHandler } from './collection-unpublished-event-handler';

describe('CollectionPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: CollectionUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new CollectionUnpublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('collection');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing collection is unpublished', async () => {
      // Arrange
      const collectionId = 'collection-1';
      await insert('collection', { id: collectionId }).run(ctx.ownerPool);
      await insert('collection_localizations', {
        collection_id: collectionId,
        title: 'Some title',
        description: 'testing',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);
      await insert('collection_images', {
        collection_id: collectionId,
        type: 'COVER',
      }).run(ctx.ownerPool);

      const message: CollectionUnpublishedEvent = {
        content_id: 'collection-1',
      };
      const messageInfo = stub<MessageInfo<CollectionUnpublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const collection = await selectOne('collection', {
        id: message.content_id,
      }).run(ctx.ownerPool);
      const localizationsCount = await count(
        'collection_localizations',
        all,
      ).run(ctx.ownerPool);
      const imagesCount = await count('collection_images', all).run(
        ctx.ownerPool,
      );

      expect(collection).toBeUndefined();

      expect(localizationsCount).toBe(0);
      expect(imagesCount).toBe(0);
    });
  });
});
