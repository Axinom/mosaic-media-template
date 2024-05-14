import { rejectionOf } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { CheckChannelJobStatusSucceededEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { CheckChannelJobStatusSucceededEventHandler } from './check-channel-job-status-succeeded-event-handler';

describe('CheckChannelJobStatusSucceededEventHandler', () => {
  let ctx: ITestContext;
  let handler: CheckChannelJobStatusSucceededEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new CheckChannelJobStatusSucceededEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('live stream is ready, but the channel is not yet registered in catalog -> error is thrown & channel is not created', async () => {
      // Arrange
      const channelId = `channel-${uuid()}`;
      const payload: CheckChannelJobStatusSucceededEvent = {
        channel_id: channelId,
        dash_stream_url: 'https://axinom-test-origin.com/channel.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel.isml/.m3u8',
      };
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<CheckChannelJobStatusSucceededEvent>;

      // Act
      const error = await ctx.executeOwnerSql(async (txn) => {
        return rejectionOf(handler.handleMessage(message, txn));
      });

      // Assert
      expect(error).toMatchObject({
        message: `Channel with id ${channelId} not found! Failed to add links to channel's live stream.`,
        code: 'CHANNEL_NOT_FOUND',
      });
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();
    });

    test('live stream is ready and channel is registered in catalog -> channel is updated', async () => {
      // Arrange
      const channelId = `channel-${uuid()}`;
      await insert('channel', {
        id: channelId,
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      const payload: CheckChannelJobStatusSucceededEvent = {
        channel_id: channelId,
        dash_stream_url: 'https://axinom-test-origin.com/channel.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel.isml/.m3u8',
      };
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<CheckChannelJobStatusSucceededEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);

      expect(channel?.dash_stream_url).toEqual(message.payload.dash_stream_url);
      expect(channel?.hls_stream_url).toEqual(message.payload.hls_stream_url);
    });
  });
});
