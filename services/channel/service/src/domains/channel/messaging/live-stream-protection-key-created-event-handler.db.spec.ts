import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { rejectionOf } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { LiveStreamProtectionKeyCreatedEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { LiveStreamProtectionKeyCreatedEventHandler } from './live-stream-protection-key-created-event-handler';

describe('LiveStreamProtectionKeyCreatedEventHandler', () => {
  let ctx: TestContext;
  let user: AuthenticatedManagementSubject;
  let handler: LiveStreamProtectionKeyCreatedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId, {
      role: ctx.config.dbOwner,
    });
    handler = new LiveStreamProtectionKeyCreatedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channels');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('live stream protection key is sent, but the channel is not found (anymore) -> error is thrown', async () => {
      // Arrange
      const channelId = uuid();
      const message = {
        payload: {
          channel_id: `channel-${channelId}`,
          key_id: uuid(),
        },
      } as unknown as TypedTransactionalMessage<LiveStreamProtectionKeyCreatedEvent>;

      // Act
      const error = await ctx.executeOwnerSql(user, async (txn) => {
        return rejectionOf(handler.handleMessage(message, txn));
      });

      // Assert
      expect(error).toMatchObject({
        message: `Channel with id ${channelId} not found! Failed to add channel's DRM key id.`,
        code: 'CHANNEL_NOT_FOUND',
      });
      const channel = await selectOne('channels', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();
    });

    test('live stream protection key is sent and channel is registered in catalog -> channel is updated', async () => {
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
          key_id: uuid(),
        },
      } as unknown as TypedTransactionalMessage<LiveStreamProtectionKeyCreatedEvent>;

      // Act
      await ctx.executeOwnerSql(user, async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channels', {
        id: channelId,
      }).run(ctx.ownerPool);

      expect(channel?.key_id).toEqual(message.payload.key_id);
    });
  });
});
