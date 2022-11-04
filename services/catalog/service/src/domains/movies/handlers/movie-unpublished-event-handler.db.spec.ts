import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { MovieUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { MovieUnpublishedEventHandler } from './movie-unpublished-event-handler';

describe('MoviePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: MovieUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new MovieUnpublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('movie');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing movie is unpublished', async () => {
      // Arrange
      await insert('movie', { id: 'movie-1', title: 'Some title' }).run(
        ctx.ownerPool,
      );

      const message: MovieUnpublishedEvent = { content_id: 'movie-1' };
      const messageInfo = stub<MessageInfo<MovieUnpublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const movie = await selectOne('movie', { id: message.content_id }).run(
        ctx.ownerPool,
      );

      expect(movie).toBeUndefined();
    });
  });
});
