import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { CollectionUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { CollectionUnpublishedEventHandler } from './collection-unpublished-event-handler';

describe('CollectionPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: CollectionUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new CollectionUnpublishedEventHandler(ctx.config);
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

      const message = {
        payload: { content_id: 'collection-1' },
      } as unknown as TypedTransactionalMessage<CollectionUnpublishedEvent>;

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const collection = await selectOne('collection', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(collection).toBeUndefined();
    });
  });
});
