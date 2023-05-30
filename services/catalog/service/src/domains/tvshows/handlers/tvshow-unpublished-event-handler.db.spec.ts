import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { TvshowUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { TvshowUnpublishedEventHandler } from './tvshow-unpublished-event-handler';

describe('TvshowPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: TvshowUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new TvshowUnpublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('tvshow');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing tvshow is unpublished', async () => {
      // Arrange
      await insert('tvshow', { id: 'tvshow-1', title: 'Some title' }).run(
        ctx.ownerPool,
      );

      const message: TvshowUnpublishedEvent = { content_id: 'tvshow-1' };
      const messageInfo = stub<MessageInfo<TvshowUnpublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const tvshow = await selectOne('tvshow', { id: message.content_id }).run(
        ctx.ownerPool,
      );

      expect(tvshow).toBeUndefined();
    });
  });
});
