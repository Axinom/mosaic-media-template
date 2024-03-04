import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { TvshowUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { TvshowUnpublishedEventHandler } from './tvshow-unpublished-event-handler';

describe('TvshowPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: TvshowUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new TvshowUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('tvshow');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing tvshow is unpublished', async () => {
      // Arrange
      await insert('tvshow', { id: 'tvshow-1', title: 'Some title' }).run(
        ctx.ownerPool,
      );

      const message = {
        payload: { content_id: 'tvshow-1' },
      } as unknown as TypedTransactionalMessage<TvshowUnpublishedEvent>;

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });
      // Assert
      const tvshow = await selectOne('tvshow', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(tvshow).toBeUndefined();
    });
  });
});
