import { rejectionOf } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  PlaylistUnpublishedEvent,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { PublicationStateEnum } from 'zapatos/custom';
import { insert, selectOne } from 'zapatos/db';
import { channels, playlists } from 'zapatos/schema';
import { CommonErrors, ValidationErrors } from '../../../common';
import {
  createTestConfig,
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { unpublishPlaylist } from './unpublish-playlist';

describe('unpublishPlaylist', () => {
  let testContext: TestContext;
  const config = createTestConfig();
  const testUser = createTestUser(config.serviceId);
  let messages: {
    messageType: string;
    message: PlaylistUnpublishedEvent;
  }[] = [];
  const storeOutboxMessage: StoreOutboxMessage = jest.fn(
    async (_aggregateId, { messageType }: { messageType: string }, message) => {
      messages.push({
        messageType,
        message: message as PlaylistUnpublishedEvent,
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

  const createPlaylist = async (
    channelId: string,
    publicationState: PublicationStateEnum,
  ): Promise<playlists.JSONSelectable> => {
    const startDate = new Date();
    return testContext.executeOwnerSql(testUser, async (txn) => {
      return insert('playlists', {
        id: uuid(),
        start_date_time: startDate,
        calculated_duration_in_seconds: 2000,
        publication_state: publicationState,
        channel_id: channelId,
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
    await testContext.truncate('playlists');
    await testContext.truncate('channels');
    messages = [];
    jest.clearAllMocks();
  });

  it('error is thrown, if playlist was not found', async () => {
    // Arrange
    const mockId = uuid();

    // Act & Assert
    const error = await testContext.executeOwnerSql(testUser, async (txn) =>
      rejectionOf(
        unpublishPlaylist(mockId, 'long-lived-token', storeOutboxMessage, txn),
      ),
    );
    expect(error).toMatchObject(CommonErrors.PlaylistNotFound);
    expect(messages).toHaveLength(0);
  });

  it('error is thrown, if playlist is not published', async () => {
    // Arrange
    const channel = await createChannel('PUBLISHED');
    const playlist = await createPlaylist(channel.id, 'NOT_PUBLISHED');

    // Act & Assert
    const error = await testContext.executeOwnerSql(testUser, async (txn) =>
      rejectionOf(
        unpublishPlaylist(
          playlist.id,
          'long-lived-token',
          storeOutboxMessage,
          txn,
        ),
      ),
    );
    expect(error).toMatchObject(
      ValidationErrors.CannotUnpublishNotPublishedPlaylist,
    );
    expect(messages).toHaveLength(0);
    const dbEntry = await testContext.executeOwnerSql(testUser, async (txn) => {
      return selectOne('playlists', {
        id: playlist.id,
      }).run(txn);
    });

    expect(dbEntry?.publication_state).toBe('NOT_PUBLISHED');
    expect(dbEntry?.published_date).toEqual(playlist.published_date);
    expect(dbEntry?.published_user).toEqual(playlist.published_user);
  });

  it('playlist is unpublished', async () => {
    // Arrange
    const channel = await createChannel('PUBLISHED');
    const playlist = await createPlaylist(channel.id, 'PUBLISHED');

    // Act
    await testContext.executeOwnerSql(testUser, async (txn) =>
      unpublishPlaylist(
        playlist.id,
        'long-lived-token',
        storeOutboxMessage,
        txn,
      ),
    );

    // Assert
    expect(messages).toHaveLength(1);
    const message = messages[0];
    expect(message.messageType).toEqual(
      ChannelServiceMessagingSettings.PlaylistUnpublished.messageType,
    );
    expect(message.message.content_id).toEqual(`playlist-${playlist.id}`);

    const dbEntry = await testContext.executeOwnerSql(testUser, async (txn) => {
      return selectOne('playlists', { id: playlist.id }).run(txn);
    });
    expect(dbEntry).not.toBeNull();
    expect(dbEntry!.publication_state).toBe('NOT_PUBLISHED');
    expect(dbEntry!.published_date).toBeNull();
  });
});
