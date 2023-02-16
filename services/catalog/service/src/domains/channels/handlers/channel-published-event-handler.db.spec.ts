import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import { channel } from 'zapatos/schema';
import {
  createChannelPublishedEvent,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { ChannelPublishedEventHandler } from './channel-published-event-handler';

describe('ChannelPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: ChannelPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ChannelPublishedEventHandler(ctx.loginPool, ctx.config);
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
      const message = createChannelPublishedEvent(uuid());

      // Act
      await handler.onMessage(message);

      // Assert
      const channel = await selectOne('channel', {
        id: message.id,
      }).run(ctx.ownerPool);
      expect(channel).toEqual<channel.JSONSelectable>({
        id: message.id,
        title: message.title,
        description: message.description ?? null,
        dash_stream_url: null,
        hls_stream_url: null,
        key_id: null,
      });

      const image = await selectOne(
        'channel_images',
        {
          channel_id: message.id,
        },
        { columns: ['height', 'width', 'path', 'type'] },
      ).run(ctx.ownerPool);
      const { id: imageId, ...messageImage } = message.images![0];
      expect(image).toMatchObject(messageImage);
    });

    test('An existing channel is republished', async () => {
      // Arrange
      await insert('channel', {
        id: 'channel-1',
        title: 'Old title',
      }).run(ctx.ownerPool);
      const message = createChannelPublishedEvent('channel-1');
      message.title = 'New title';

      // Act
      await handler.onMessage(message);

      // Assert
      const channel = await selectOne('channel', {
        id: message.id,
      }).run(ctx.ownerPool);

      expect(channel?.title).toEqual('New title');
    });
  });
});
