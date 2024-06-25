import { rejectionOf } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { LiveStreamProtectionKeyCreatedEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { LiveStreamProtectionKeyCreatedEventHandler } from './live-stream-protection-key-created-event-handler';

describe('LiveStreamProtectionKeyCreatedEventHandler', () => {
  let ctx: ITestContext;
  let handler: LiveStreamProtectionKeyCreatedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new LiveStreamProtectionKeyCreatedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('live stream protection key is sent, but the channel is not yet registered in catalog -> error is thrown & channel is not created', async () => {
      // Arrange
      const channelId = `channel-${uuid()}`;
      const payload: LiveStreamProtectionKeyCreatedEvent = {
        channel_id: channelId,
        key_id: uuid(),
      };
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<LiveStreamProtectionKeyCreatedEvent>;

      // Act
      const error = await ctx.executeOwnerSql(async (txn) => {
        return rejectionOf(handler.handleMessage(message, txn));
      });

      // Assert
      expect(error).toMatchObject({
        message: `Channel with id ${channelId} not found! Failed to add channel's DRM key id.`,
        code: 'CHANNEL_NOT_FOUND',
      });
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();
    });

    test('live stream protection key is sent and channel is registered in catalog -> channel is updated', async () => {
      // Arrange
      const channelId = `channel-${uuid()}`;
      await insert('channel', {
        id: channelId,
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      const payload: LiveStreamProtectionKeyCreatedEvent = {
        channel_id: channelId,
        key_id: uuid(),
      };
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<LiveStreamProtectionKeyCreatedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);

      expect(channel?.key_id).toEqual(message.payload.key_id);
    });
  });
});
