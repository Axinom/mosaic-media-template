import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { PlaylistUnpublishedEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { PlaylistUnpublishedEventHandler } from './playlist-unpublished-event-handler';

const channelId = `channel-${uuid()}`;

describe('PlaylistPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: PlaylistUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('channel', { id: channelId }).run(ctx.ownerPool);
    handler = new PlaylistUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('playlist');
  });

  afterAll(async () => {
    await ctx?.truncate('channel');
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing playlist is unpublished', async () => {
      // Arrange
      const playlistId = `playlist-${uuid()}`;
      await insert('playlist', {
        id: playlistId,
        channel_id: channelId,
        start_date_time: '2024-04-25T08:26:34.018247+00:00',
        end_date_time: '2024-04-25T19:34:32.010241+00:00',
      }).run(ctx.ownerPool);

      const payload: PlaylistUnpublishedEvent = {
        content_id: playlistId,
        channel_id: channelId,
      };
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<PlaylistUnpublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const playlist = await selectOne('playlist', {
        id: playlistId,
      }).run(ctx.ownerPool);
      expect(playlist).toBeUndefined();
    });
  });
});
