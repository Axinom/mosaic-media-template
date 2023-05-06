import { rejectionOf } from '@axinom/mosaic-service-common';
import { EnsureChannelLiveReadyEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { EnsureChannelLiveReadyEventHandler } from './ensure-channel-live-ready-event-handler';

describe('EnsureChannelLiveReadyEventHandler', () => {
  let ctx: ITestContext;
  let handler: EnsureChannelLiveReadyEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new EnsureChannelLiveReadyEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('live stream is ready, but the channel is not yet registered in catalog -> error is thrown & channel is not created', async () => {
      // Arrange
      const message: EnsureChannelLiveReadyEvent = {
        channel_id: uuid(),
        dash_stream_url: 'https://axinom-test-origin.com/channel.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel.isml/.m3u8',
      };

      // Act
      const error = await rejectionOf(handler.onMessage(message));

      // Assert
      expect(error).toMatchObject({
        message: `Channel with id ${message.channel_id} not found! Failed to add links to channel's live stream.`,
        code: 'CHANNEL_NOT_FOUND',
      });
      const channel = await selectOne('channel', {
        id: message.channel_id,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();
    });

    test('live stream is ready and channel is registered in catalog -> channel is updated', async () => {
      // Arrange
      await insert('channel', {
        id: 'channel-1',
        title: 'Old title',
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      const message: EnsureChannelLiveReadyEvent = {
        channel_id: 'channel-1',
        dash_stream_url: 'https://axinom-test-origin.com/channel.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel.isml/.m3u8',
      };

      // Act
      await handler.onMessage(message);

      // Assert
      const channel = await selectOne('channel', {
        id: message.channel_id,
      }).run(ctx.ownerPool);

      expect(channel?.dash_stream_url).toEqual(message.dash_stream_url);
      expect(channel?.hls_stream_url).toEqual(message.hls_stream_url);
    });
  });
});
