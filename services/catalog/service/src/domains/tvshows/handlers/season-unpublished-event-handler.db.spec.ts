import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { SeasonUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { SeasonUnpublishedEventHandler } from './season-unpublished-event-handler';

describe('SeasonPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: SeasonUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new SeasonUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('season');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing season is unpublished', async () => {
      // Arrange
      await insert('season', {
        id: 'season-1',
        description: 'Some description',
      }).run(ctx.ownerPool);

      const message = {
        payload: { content_id: 'season-1' },
      } as unknown as TypedTransactionalMessage<SeasonUnpublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });
      // Assert
      const season = await selectOne('season', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(season).toBeUndefined();
    });
  });
});
