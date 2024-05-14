import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { v4 as uuid } from 'uuid';
import { insert } from 'zapatos/db';
import {
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { aggregateChannelPublishDto } from './aggregate-channel-publish-dto';

describe('create channel publish dto', () => {
  let ctx: TestContext;
  let user: AuthenticatedManagementSubject;
  const testChannelId = uuid();
  const testImageId = uuid();

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId, {
      role: ctx.config.dbOwner,
    });
  });

  afterEach(async () => {
    await ctx.truncate('channels');
    await ctx.truncate('channel_images');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  it('publish dto is created', async () => {
    // Arrange
    await ctx.executeOwnerSql(user, async (ctx) =>
      insert('channels', {
        id: testChannelId,
        title: 'Test Channel',
        description: 'Channel for testing.',
      }).run(ctx),
    );

    // Act
    const dto = await ctx.executeOwnerSql(user, async (ctx) =>
      aggregateChannelPublishDto(testChannelId, ctx),
    );

    // Assert
    expect(dto).toMatchObject({
      id: testChannelId,
      title: 'Test Channel',
      description: 'Channel for testing.',
      images: [],
    });
  });

  it('publish dto has images', async () => {
    // Arrange
    await ctx.executeOwnerSql(user, async (ctx) => {
      await insert('channels', {
        id: testChannelId,
        title: 'Test Channel',
        description: 'Channel for testing.',
      }).run(ctx);
      insert('channel_images', {
        channel_id: testChannelId,
        image_id: testImageId,
        image_type: 'LOGO',
      }).run(ctx);
    });

    // Act
    const dto = await ctx.executeOwnerSql(user, async (ctx) =>
      aggregateChannelPublishDto(testChannelId, ctx),
    );

    // Assert
    expect(dto).toMatchObject({
      id: testChannelId,
      title: 'Test Channel',
      description: 'Channel for testing.',
      images: [
        {
          image_id: testImageId,
          image_type: 'LOGO',
        },
      ],
    });
  });
});
