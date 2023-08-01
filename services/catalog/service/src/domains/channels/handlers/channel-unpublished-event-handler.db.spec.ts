import { MessageInfo } from '@axinom/mosaic-message-bus';
import { ChannelUnpublishedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { insert, select, selectOne } from 'zapatos/db';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { getChannelId } from '../common';
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
      const originalId = uuid();
      const channelId = getChannelId(originalId);
      const insertedChannel = await insert('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      await insert('channel_images', {
        channel_id: insertedChannel.id,
        path: 'testing.png',
        height: 10,
        width: 10,
        type: 'LOGO',
      }).run(ctx.ownerPool);
      await insert('channel_localizations', {
        channel_id: channelId,
        title: 'Some title',
        description: 'testing',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);

      const message: ChannelUnpublishedEvent = {
        id: originalId,
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
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();

      const channelImage = await selectOne('channel_images', {
        channel_id: channelId,
      }).run(ctx.ownerPool);
      expect(channelImage).toBeUndefined();

      const channelLocalizations = await select('channel_localizations', {
        channel_id: channelId,
      }).run(ctx.ownerPool);
      expect(channelLocalizations).toHaveLength(0);
    });
  });
});
