import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import { EpisodeUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { EpisodeUnpublishedEventHandler } from './episode-unpublished-event-handler';

describe('EpisodePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: EpisodeUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new EpisodeUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('episode');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing episode is unpublished', async () => {
      // Arrange
      await insert('episode', { id: 'episode-1', title: 'Some title' }).run(
        ctx.ownerPool,
      );

      const message = {
        payload: { content_id: 'episode-1' },
      } as unknown as TypedTransactionalMessage<EpisodeUnpublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const episode = await selectOne('episode', {
        id: message.payload.content_id,
      }).run(ctx.ownerPool);

      expect(episode).toBeUndefined();
    });
  });
});
