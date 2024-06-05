import { rejectionOf } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  ChannelServiceMessagingSettings,
  PlaylistPublishedEvent,
} from 'media-messages';
import Hasher from 'node-object-hash';
import { v4 as uuid } from 'uuid';
import { PublicationStateEnum } from 'zapatos/custom';
import { ExtrasResult, insert, selectOne, sql, SQLFragment } from 'zapatos/db';
import { channels, playlists } from 'zapatos/schema';
import { CommonErrors } from '../../../common';
import * as isManagedServiceEnabled from '../../../common/utils/is-managed-service-enabled';
import { PublishValidationResult } from '../../../publishing';
import {
  createTestConfig,
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { publishPlaylist } from './publish-playlist';
import * as validatePlaylistExports from './validate-playlist';

describe('publishPlaylist', () => {
  const hasher = Hasher();
  let testContext: TestContext;
  const config = createTestConfig();
  const testUser = createTestUser(config.serviceId);
  let messages: {
    messageType: string;
    message: PlaylistPublishedEvent;
  }[] = [];
  const storeOutboxMessage: StoreOutboxMessage = jest.fn(
    async (_aggregateId, { messageType }, message) => {
      messages.push({
        messageType,
        message: message as PlaylistPublishedEvent,
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
  ): Promise<
    playlists.JSONSelectable &
      ExtrasResult<
        'playlists',
        { calculated_end_date_time: SQLFragment<string, never> }
      >
  > => {
    const startDate = new Date();
    return testContext.executeOwnerSql(testUser, async (txn) => {
      return insert(
        'playlists',
        {
          id: uuid(),
          title: startDate.toISOString().substring(0, 10),
          start_date_time: startDate,
          calculated_duration_in_seconds: 2000,
          publication_state: publicationState,
          channel_id: channelId,
          published_date:
            publicationState !== 'NOT_PUBLISHED' ? new Date() : null,
          published_user:
            publicationState !== 'NOT_PUBLISHED' ? testUser.name : null,
        },
        {
          extras: {
            calculated_end_date_time: sql`${'start_date_time'} + ${'calculated_duration_in_seconds'} * interval '1 seconds'`,
          },
        },
      ).run(txn);
    });
  };

  beforeEach(async () => {
    jest
      .spyOn(isManagedServiceEnabled, 'isManagedServiceEnabled')
      .mockImplementation(
        async (_serviceId, _idServiceBaseUrl, _authToken): Promise<boolean> => {
          return true;
        },
      );
  });

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
        publishPlaylist(
          mockId,
          'mock-hash',
          'jwt-bearer-token',
          'long-lived-token',
          storeOutboxMessage,
          txn,
          testContext.config,
        ),
      ),
    );
    expect(error).toMatchObject(CommonErrors.PlaylistNotFound);
    expect(messages).toHaveLength(0);
  });

  it('playlist is published', async () => {
    // Arrange
    const channel = await createChannel('PUBLISHED');
    const playlist = await createPlaylist(channel.id, 'NOT_PUBLISHED');
    const expectedPublishedPayload = {
      content_id: playlist.id,
      channel_id: channel.id,
      title: playlist.start_date_time.substring(0, 10),
      start_date_time: playlist.start_date_time,
      end_date_time: playlist.calculated_end_date_time,
      programs: [],
    };
    const publishHash = hasher.hash(expectedPublishedPayload);
    jest
      .spyOn(validatePlaylistExports, 'validatePlaylist')
      .mockImplementation(
        async (
          _id,
          _authToken,
          _gqlClient,
          _config,
        ): Promise<PublishValidationResult<PlaylistPublishedEvent>> => {
          return {
            publishHash,
            publishPayload: expectedPublishedPayload,
            validations: [],
            validationStatus: 'OK',
          };
        },
      );

    // Act
    await testContext.executeOwnerSql(testUser, async (txn) => {
      await publishPlaylist(
        playlist.id,
        publishHash,
        'jwt-bearer-token',
        'long-lived-token',
        storeOutboxMessage,
        txn,
        testContext.config,
      );
    });

    // Assert
    expect(messages).toHaveLength(1);
    const message = messages[0];
    expect(message.messageType).toEqual(
      ChannelServiceMessagingSettings.PlaylistPublished.messageType,
    );
    const payload = message.message;
    expect(payload).toMatchObject(expectedPublishedPayload);

    const dbEntry = await testContext.executeOwnerSql(testUser, async (txn) => {
      return selectOne('playlists', { id: playlist.id }).run(txn);
    });
    expect(dbEntry).not.toBeNull();
    expect(dbEntry!.publication_state).toBe('PUBLISHED');
    expect(dbEntry!.published_date).not.toBeNull();
  });
});
