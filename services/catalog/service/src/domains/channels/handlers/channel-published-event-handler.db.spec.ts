import { v4 as uuid } from 'uuid';
import { insert, parent, select, selectOne } from 'zapatos/db';
import { channel } from 'zapatos/schema';
import {
  createChannelPublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { ChannelPublishedEventHandler } from './channel-published-event-handler';

describe('ChannelPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: ChannelPublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new ChannelPublishedEventHandler(ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('channel');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    test('A new channel is published', async () => {
      // Arrange
      const message = createChannelPublishedMessage(`channel-${uuid()}`);
      const payload = message.payload;

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: payload.content_id,
      }).run(ctx.ownerPool);
      expect(channel).toEqual<channel.JSONSelectable>({
        id: payload.content_id,
        dash_stream_url: null,
        hls_stream_url: null,
        key_id: null,
      });

      const image = await selectOne(
        'channel_images',
        {
          channel_id: payload.content_id,
        },
        { columns: ['height', 'width', 'path', 'type', 'alt_text'] },
      ).run(ctx.ownerPool);
      const { id: imageId, ...messageImage } = payload.images![0];
      expect(image).toMatchObject(messageImage);
    });

    test('An existing channel is republished', async () => {
      // Arrange
      const message = createChannelPublishedMessage(`channel-${uuid()}`);
      const payload = message.payload;
      await insert('channel', {
        id: payload.content_id,
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      await insert('channel_localizations', {
        channel_id: payload.content_id,
        is_default_locale: true,
        locale: 'en-US',
        title: 'English title',
        description: 'English description',
      }).run(ctx.ownerPool);
      await insert('channel_localizations', {
        channel_id: payload.content_id,
        is_default_locale: false,
        locale: 'de-DE',
        title: 'German title',
        description: 'German description',
      }).run(ctx.ownerPool);
      message.payload.localizations.forEach((l) => {
        if (l.language_tag === 'de-DE') {
          l.title = 'New German title';
        }
      });

      // Act
      await ctx.executeOwnerSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne(
        'channel',
        {
          id: payload.content_id,
        },
        {
          lateral: {
            localizations: select('channel_localizations', {
              channel_id: parent('id'),
            }),
          },
        },
      ).run(ctx.ownerPool);
      expect(channel?.dash_stream_url).toEqual(
        'https://axinom-test-origin.com/channel-1.isml/.mpd',
      );
      expect(channel?.hls_stream_url).toEqual(
        'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      );
      expect(channel?.localizations).toHaveLength(2);
      const germanLocalization = channel?.localizations.find(
        (l) => l.locale === 'de-DE',
      );
      expect(germanLocalization?.title).toEqual('New German title');
    });
  });
});
