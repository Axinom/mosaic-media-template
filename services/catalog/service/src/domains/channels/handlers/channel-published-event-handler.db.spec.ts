import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { channel } from 'zapatos/schema';
import {
  createChannelPublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { getChannelId } from '../common';
import { ChannelPublishedEventHandler } from './channel-published-event-handler';

describe('ChannelPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: ChannelPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ChannelPublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('A new channel is published', async () => {
      // Arrange
      const message = createChannelPublishedMessage(uuid());
      const payload = message.payload;
      const channelId = getChannelId(payload.id);

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toEqual<channel.JSONSelectable>({
        id: channelId,
        title: message.payload.title,
        description: message.payload.description ?? null,
        dash_stream_url: null,
        hls_stream_url: null,
        key_id: null,
      });

      const image = await selectOne(
        'channel_images',
        {
          channel_id: channelId,
        },
        { columns: ['height', 'width', 'path', 'type'] },
      ).run(ctx.ownerPool);
      const { id: imageId, ...messageImage } = message.payload.images![0];
      expect(image).toMatchObject(messageImage);
    });

    test('An existing channel is republished', async () => {
      // Arrange
      const message = createChannelPublishedMessage(uuid());
      const channelId = getChannelId(message.id);
      await insert('channel', {
        id: channelId,
        title: 'Old title',
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      message.payload.title = 'New title';

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);

      expect(channel?.title).toEqual('New title');
      expect(channel?.dash_stream_url).toEqual(
        'https://axinom-test-origin.com/channel-1.isml/.mpd',
      );
      expect(channel?.hls_stream_url).toEqual(
        'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      );
    });
  });
});
