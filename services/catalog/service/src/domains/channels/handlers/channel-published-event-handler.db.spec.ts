import 'jest-extended';
import { v4 as uuid } from 'uuid';
import { insert, select, selectOne } from 'zapatos/db';
import { channel } from 'zapatos/schema';
import { DEFAULT_LOCALE_TAG } from '../../../common';
import {
  createChannelPublishedMessage,
  createTestContext,
  ITestContext,
} from '../../../tests/test-utils';
import { getChannelId } from '../common';
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

  describe('onMessage', () => {
    test('A new channel is published without localizations', async () => {
      // Arrange
      const message = createChannelPublishedMessage(uuid());
      const payload = message.payload;
      const channelId = getChannelId(payload.id);

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toEqual<channel.JSONSelectable>({
        id: channelId,
        dash_stream_url: null,
        hls_stream_url: null,
        key_id: null,
      });

      const image = await selectOne(
        'channel_images',
        { channel_id: channelId },
        { columns: ['height', 'width', 'path', 'type'] },
      ).run(ctx.ownerPool);
      const { id: imageId, ...messageImage } = payload.images![0];
      expect(image).toEqual(messageImage);

      const localizations = await select(
        'channel_localizations',
        { channel_id: channelId },
        { columns: ['title', 'description', 'locale', 'is_default_locale'] },
      ).run(ctx.ownerPool);
      expect(localizations).toEqual([
        {
          title: payload.title,
          description: payload.description ?? null,
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
      ]);
    });

    test('A new channel is published with localizations', async () => {
      // Arrange
      const message = createChannelPublishedMessage(uuid());
      const payload = message.payload;
      message.localizations = [
        {
          language_tag: 'en-US',
          is_default_locale: true,
          title: 'default title',
          description: 'default description',
        },
        {
          language_tag: 'de-DE',
          is_default_locale: false,
          title: 'localized title 1',
          description: 'localized description 1',
        },
        {
          language_tag: 'et-EE',
          is_default_locale: false,
          title: 'localized title 2',
          description: 'localized description 2',
        },
      ];
      const channelId = getChannelId(message.id);

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);
      expect(channel).toEqual<channel.JSONSelectable>({
        id: channelId,
        dash_stream_url: null,
        hls_stream_url: null,
        key_id: null,
      });

      const image = await selectOne(
        'channel_images',
        { channel_id: channelId },
        { columns: ['height', 'width', 'path', 'type'] },
      ).run(ctx.ownerPool);
      const { id: imageId, ...messageImage } = payload.images![0];
      expect(image).toEqual(messageImage);

      const localizations = await select(
        'channel_localizations',
        { channel_id: channelId },
        { columns: ['title', 'description', 'locale', 'is_default_locale'] },
      ).run(ctx.ownerPool);
      expect(localizations).toIncludeAllMembers(
        //TODO: Remove `as any[]` when messages lib is updated
        (payload.localizations as any[]).map(({ language_tag, ...other }) => ({
          ...other,
          locale: language_tag,
        })),
      );
    });

    test('An existing channel is republished', async () => {
      // Arrange
      const message = createChannelPublishedMessage(uuid());
      const payload = message.payload;
      payload.title = 'New title';

      const channelId = getChannelId(payload.id);
      await insert('channel', {
        id: channelId,
        dash_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.mpd',
        hls_stream_url: 'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      }).run(ctx.ownerPool);
      await insert('channel_localizations', {
        channel_id: channelId,
        title: 'Old title',
        locale: DEFAULT_LOCALE_TAG,
        is_default_locale: true,
      }).run(ctx.ownerPool);

      // Act
      await ctx.executeGqlSql(async (txn) => {
        await handler.handleMessage(message, txn);
      });

      // Assert
      const channel = await selectOne('channel', {
        id: channelId,
      }).run(ctx.ownerPool);

      expect(channel?.dash_stream_url).toEqual(
        'https://axinom-test-origin.com/channel-1.isml/.mpd',
      );
      expect(channel?.hls_stream_url).toEqual(
        'https://axinom-test-origin.com/channel-1.isml/.m3u8',
      );

      const localization = await select(
        'channel_localizations',
        { channel_id: channelId },
        { columns: ['title', 'description', 'locale', 'is_default_locale'] },
      ).run(ctx.ownerPool);
      expect(localization).toEqual([
        {
          title: 'New title',
          description: payload.description,
          locale: DEFAULT_LOCALE_TAG,
          is_default_locale: true,
        },
      ]);
    });
  });
});
