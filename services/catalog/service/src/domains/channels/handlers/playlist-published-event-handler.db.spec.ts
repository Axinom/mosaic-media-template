import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { PlaylistPublishedEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { playlist } from 'zapatos/schema';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { PlaylistPublishedEventHandler } from './playlist-published-event-handler';

const channelId = `channel-${uuid()}`;

const createPlaylistPublishedPayload = (): PlaylistPublishedEvent => ({
  content_id: `playlist-${uuid()}`,
  channel_id: channelId,
  start_date_time: '2024-04-25T08:26:34.018247+00:00',
  end_date_time: '2024-04-25T19:34:32.010241+00:00',
  programs: [],
});

describe('PlaylistPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: PlaylistPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    await insert('channel', { id: channelId }).run(ctx.ownerPool);
    handler = new PlaylistPublishedEventHandler(ctx.config);
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
    test('A new playlist is published', async () => {
      // Arrange
      const payload = createPlaylistPublishedPayload();
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<PlaylistPublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const playlist = await selectOne('playlist', {
        id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(playlist).toEqual<playlist.JSONSelectable>({
        id: payload.content_id,
        channel_id: payload.channel_id,
        start_date_time: payload.start_date_time,
        end_date_time: payload.end_date_time,
      });
    });

    test('An existing playlist is republished', async () => {
      // Arrange
      const payload = createPlaylistPublishedPayload();
      await insert('playlist', {
        id: payload.content_id,
        channel_id: channelId,
        start_date_time: '2020-01-01T00:00:00.000000+00:00',
        end_date_time: '2020-01-02T00:00:00.000000+00:00',
      }).run(ctx.ownerPool);
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<PlaylistPublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const playlist = await selectOne('playlist', {
        id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(playlist?.start_date_time).toEqual(
        '2024-04-25T08:26:34.018247+00:00',
      );
      expect(playlist?.end_date_time).toEqual(
        '2024-04-25T19:34:32.010241+00:00',
      );
    });
  });
});
