import { MessageInfo } from '@axinom/mosaic-message-bus';
import { ChannelUnpublishedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { ChannelUnpublishedEventHandler } from './channel-unpublished-event-handler';

describe('ChannelPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: ChannelUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ChannelUnpublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing channel is unpublished', async () => {
      // Arrange
      const channelId = uuid();
      const insertedChannel = await insert('channel', {
        id: channelId,
        title: 'Some title',
        description: 'testing',
      }).run(ctx.ownerPool);
      await insert('channel_images', {
        channel_id: insertedChannel.id,
        path: 'testing.png',
        height: 10,
        width: 10,
        type: 'LOGO',
      }).run(ctx.ownerPool);

      const message: ChannelUnpublishedEvent = {
        id: channelId,
      };
      const messageInfo = stub<MessageInfo<ChannelUnpublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const channel = await selectOne('channel', {
        id: message.id,
      }).run(ctx.ownerPool);

      expect(channel).toBeUndefined();
      const channelImage = await selectOne('channel_images', {
        channel_id: message.id,
      }).run(ctx.ownerPool);

      expect(channelImage).toBeUndefined();
    });
  });
});
