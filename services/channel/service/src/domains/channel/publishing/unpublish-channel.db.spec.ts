import { rejectionOf } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  ChannelUnpublishedEvent,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { PublicationStateEnum } from 'zapatos/custom';
import { insert, selectOne } from 'zapatos/db';
import { channels } from 'zapatos/schema';
import { CommonErrors, ValidationErrors } from '../../../common';
import {
  createTestConfig,
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { unpublishChannel } from './unpublish-channel';

describe('unpublishChannel', () => {
  let testContext: TestContext;
  const config = createTestConfig();
  const testUser = createTestUser(config.serviceId);
  let messages: {
    messageType: string;
    message: ChannelUnpublishedEvent;
  }[] = [];
  const storeOutboxMessage: StoreOutboxMessage = jest.fn(
    async (_aggregateId, { messageType }: { messageType: string }, message) => {
      messages.push({
        messageType,
        message: message as ChannelUnpublishedEvent,
      });
    },
  );

  const createChannel = async (
    publicationState: PublicationStateEnum,
  ): Promise<channels.JSONSelectable> => {
    return testContext.executeOwnerSql(testUser, async (txn) => {
      return insert('channels', {
        id: uuid(),
        title: 'Axinom Test Channel',
        description: 'Best channel to look for testing videos.',
        publication_state: publicationState,
        published_date:
          publicationState !== 'NOT_PUBLISHED' ? new Date() : null,
        published_user:
          publicationState !== 'NOT_PUBLISHED' ? testUser.name : null,
      }).run(txn);
    });
  };

  beforeAll(async () => {
    testContext = await createTestContext({});
  });

  afterAll(async () => {
    await testContext.dispose();
  });

  afterEach(async () => {
    await testContext.truncate('channels');
    messages = [];
    jest.clearAllMocks();
  });

  it('error is thrown, if channel was not found', async () => {
    // Arrange
    const mockId = uuid();
    // Act & Assert
    const error = await testContext.executeOwnerSql(testUser, async (txn) =>
      rejectionOf(
        unpublishChannel(mockId, 'long-lived-token', storeOutboxMessage, txn),
      ),
    );
    expect(error).toMatchObject(CommonErrors.ChannelNotFound);
    expect(messages).toHaveLength(0);
  });

  it('error is thrown, if channel is not published', async () => {
    // Arrange
    const channel = await createChannel('NOT_PUBLISHED');

    // Act & Assert
    const error = await testContext.executeOwnerSql(testUser, async (txn) =>
      rejectionOf(
        unpublishChannel(
          channel.id,
          'long-lived-token',
          storeOutboxMessage,
          txn,
        ),
      ),
    );
    expect(error).toMatchObject(
      ValidationErrors.CannotUnpublishNotPublishedChannel,
    );
    expect(messages).toHaveLength(0);
    const dbEntry = await testContext.executeOwnerSql(testUser, async (txn) => {
      return selectOne('channels', {
        id: channel.id,
      }).run(txn);
    });

    expect(dbEntry?.publication_state).toBe('NOT_PUBLISHED');
    expect(dbEntry?.published_date).toEqual(channel.published_date);
    expect(dbEntry?.published_user).toEqual(channel.published_user);
  });

  it('channel is unpublished', async () => {
    // Arrange
    const channel = await createChannel('PUBLISHED');

    // Act
    const dbEntry = await testContext.executeOwnerSql(testUser, async (txn) => {
      await unpublishChannel(
        channel.id,
        'long-lived-token',
        storeOutboxMessage,
        txn,
      );

      // Assert
      expect(messages).toHaveLength(1);
      const message = messages[0];
      expect(message.messageType).toEqual(
        ChannelServiceMessagingSettings.ChannelUnpublished.messageType,
      );
      expect(message.message.content_id).toEqual(`channel-${channel.id}`);

      return selectOne('channels', { id: channel.id }).run(txn);
    });
    expect(dbEntry).not.toBeNull();
    expect(dbEntry!.publication_state).toBe('NOT_PUBLISHED');
    expect(dbEntry!.published_date).toBeNull();
    expect(dbEntry!.dash_stream_url).toBeNull();
    expect(dbEntry!.hls_stream_url).toBeNull();
    expect(dbEntry!.key_id).toBeNull();
  });
});
