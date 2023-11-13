import { ChannelUnpublishedEvent } from '@axinom/mosaic-messages';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { getChannelId } from '../common';
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

  describe('onMessage', () => {
    test('An existing channel is unpublished', async () => {
      // Arrange
      const originalId = uuid();
      const channelId = getChannelId(originalId);
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

      const message = {
        payload: { id: originalId },
      } as unknown as TypedTransactionalMessage<ChannelUnpublishedEvent>;

      // Act
      await ctx.executeGqlSql(async (txn) => {
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
    });
  });
});
