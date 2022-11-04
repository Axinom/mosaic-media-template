import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { CollectionUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
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
      await insert('collection', {
        id: 'collection-1',
        title: 'Some title',
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

      expect(collection).toBeUndefined();
    });
  });
});
