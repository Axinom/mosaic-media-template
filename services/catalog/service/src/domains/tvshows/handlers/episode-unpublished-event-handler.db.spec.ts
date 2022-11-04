import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { EpisodeUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { EpisodeUnpublishedEventHandler } from './episode-unpublished-event-handler';

describe('EpisodePublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: EpisodeUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new EpisodeUnpublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('episode');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing episode is unpublished', async () => {
      // Arrange
      await insert('episode', { id: 'episode-1', title: 'Some title' }).run(
        ctx.ownerPool,
      );

      const message: EpisodeUnpublishedEvent = { content_id: 'episode-1' };
      const messageInfo = stub<MessageInfo<EpisodeUnpublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const episode = await selectOne('episode', {
        id: message.content_id,
      }).run(ctx.ownerPool);

      expect(episode).toBeUndefined();
    });
  });
});
