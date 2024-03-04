import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { MovieUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { MovieUnpublishedEventHandler } from './movie-unpublished-event-handler';

describe('MoviePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MovieUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MovieUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('movie');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing movie is unpublished', async () => {
      // Arrange
      await insert('movie', { id: 'movie-1', title: 'Some title' }).run(
        ctx.ownerPool,
      );

      const message = {
        payload: { content_id: 'movie-1' },
      } as unknown as TypedTransactionalMessage<MovieUnpublishedEvent>;

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const movie = await selectOne('movie', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(movie).toBeUndefined();
    });
  });
});
