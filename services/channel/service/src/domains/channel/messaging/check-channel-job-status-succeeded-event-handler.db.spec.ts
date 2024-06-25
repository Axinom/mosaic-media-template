import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { rejectionOf } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { CheckChannelJobStatusSucceededEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { CheckChannelJobStatusSucceededEventHandler } from './check-channel-job-status-succeeded-event-handler';

describe('CheckChannelJobStatusSucceededEventHandler', () => {
  let ctx: TestContext;
  let user: AuthenticatedManagementSubject;
  let handler: CheckChannelJobStatusSucceededEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId, {
      role: ctx.config.dbOwner,
    });
    handler = new CheckChannelJobStatusSucceededEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channels');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('live stream is ready, but the channel is not found (anymore) -> error is thrown', async () => {
      // Arrange
      const channelId = uuid();
      const message = {
        payload: {
          channel_id: `channel-${channelId}`,
          dash_stream_url: 'https://axinom-test-origin.com/channel.isml/.mpd',
          hls_stream_url: 'https://axinom-test-origin.com/channel.isml/.m3u8',
        },
      } as unknown as TypedTransactionalMessage<CheckChannelJobStatusSucceededEvent>;

      // Act
      const error = await ctx.executeOwnerSql(user, async (txn) => {
        return rejectionOf(handler.handleMessage(message, txn));
      });

      // Assert
      expect(error).toMatchObject({
        message: `Channel with id ${channelId} not found! Failed to add links to the channel.`,
        code: 'CHANNEL_NOT_FOUND',
      });
      const channel = await selectOne('channels', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();
    });

    test('live stream is ready -> channel is updated', async () => {
      // Arrange
      const channelId = uuid();
      await insert('channels', {
        id: channelId,
        title: 'Old title',
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      const message = {
        payload: {
          channel_id: `channel-${channelId}`,
          dash_stream_url: 'https://axinom-test-origin.com/channel.isml/.mpd',
          hls_stream_url: 'https://axinom-test-origin.com/channel.isml/.m3u8',
        },
      } as unknown as TypedTransactionalMessage<CheckChannelJobStatusSucceededEvent>;

      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channels', {
        id: channelId,
      }).run(ctx.ownerPool);

      expect(channel?.dash_stream_url).toEqual(message.payload.dash_stream_url);
      expect(channel?.hls_stream_url).toEqual(message.payload.hls_stream_url);
    });
  });
});
