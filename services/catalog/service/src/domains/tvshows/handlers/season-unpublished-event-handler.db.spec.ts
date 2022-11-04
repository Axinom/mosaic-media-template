import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { SeasonUnpublishedEvent } from 'media-messages';
import { insert, selectOne } from 'zapatos/db';
import { createTestContext, ITestContext } from '../../../tests/test-utils';
import { SeasonUnpublishedEventHandler } from './season-unpublished-event-handler';

describe('SeasonPublishEventHandler', () => {
  let ctx: ITestContext;
  let handler: SeasonUnpublishedEventHandler;

  beforeAll(async () => {
    ctx = await createTestContext();
    handler = new SeasonUnpublishedEventHandler(ctx.loginPool, ctx.config);
  });

  afterEach(async () => {
    await ctx?.truncate('season');
  });

  afterAll(async () => {
    await ctx?.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    test('An existing season is unpublished', async () => {
      // Arrange
      await insert('season', {
        id: 'season-1',
        description: 'Some description',
      }).run(ctx.ownerPool);

      const message: SeasonUnpublishedEvent = { content_id: 'season-1' };
      const messageInfo = stub<MessageInfo<SeasonUnpublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload: message,
        },
      });

      // Act
      await handler.onMessage(message, messageInfo);

      // Assert
      const season = await selectOne('season', { id: message.content_id }).run(
        ctx.ownerPool,
      );

      expect(season).toBeUndefined();
    });
  });
});
