import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ChannelUnpublishedEvent } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { ChannelUnpublishedEventHandler } from './channel-unpublished-event-handler';

describe('ChannelPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: ChannelUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ChannelUnpublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('An existing channel is unpublished', async () => {
      // Arrange
      const channelId = `channel-${uuid()}`;
      await insert('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      await insert('channel_images', {
        channel_id: channelId,
        path: 'testing.png',
        height: 10,
        width: 10,
        type: 'LOGO',
      }).run(ctx.ownerPool);
      await insert('channel_localizations', {
        locale: 'en-US',
        is_default_locale: true,
        title: 'Some title',
        description: 'testing',
      }).run(ctx.ownerPool);
      await insert('channel_localizations', {
        locale: 'de-DE',
        is_default_locale: true,
        title: 'Ein Titel',
        description: 'Testen',
      }).run(ctx.ownerPool);

      const payload: ChannelUnpublishedEvent = {
        content_id: channelId,
      };
      const message = {
        payload,
      } as unknown as TypedTransactionalMessage<ChannelUnpublishedEvent>;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toBeUndefined();

      const channelImage = await selectOne('channel_images', {
        channel_id: channelId,
      }).run(ctx.ownerPool);
      expect(channelImage).toBeUndefined();

      const channelLocalization = await selectOne('channel_localizations', {
        channel_id: channelId,
      }).run(ctx.ownerPool);
      expect(channelLocalization).toBeUndefined();
    });
  });
});
