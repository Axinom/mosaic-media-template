import { rejectionOf } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import 'jest-extended';
import {
  ChannelLocalization,
  ChannelPublishedEvent,
  ChannelServiceMessagingSettings,
  DetailedImage,
  DetailedVideo,
} from 'media-messages';
import Hasher from 'node-object-hash';
import { v4 as uuid } from 'uuid';
import { PublicationStateEnum } from 'zapatos/custom';
import { insert, selectOne } from 'zapatos/db';
import { channels } from 'zapatos/schema';
import { CommonErrors, ValidationErrors } from '../../../common';
import * as getValidationAndLocalizations from '../../../publishing/common/localization/get-validation-and-localizations';
import {
  createValidationError,
  createValidationWarning,
  PublishValidationResult,
} from '../../../publishing/models';
import {
  createTestConfig,
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { publishChannel } from './publish-channel';
import * as validateChannelExports from './validate-channel';

describe('publishChannel', () => {
  const hasher = Hasher();
  let testContext: TestContext;
  const config = createTestConfig();
  const testUser = createTestUser(config.serviceId);
  let messages: {
    messageType: string;
    message: ChannelPublishedEvent;
  }[] = [];
  const storeOutboxMessage: StoreOutboxMessage = jest.fn(
    async (_aggregateId, { messageType }, message) => {
      messages.push({
        messageType,
        message: message as ChannelPublishedEvent,
      });
    },
  );

  const createImages = (imageIds: string[]): DetailedImage[] => {
    return imageIds.map((element) => {
      return {
        id: element,
        path: `test/${element}/image.png`,
        width: 100,
        height: 100,
        type: 'test_cover',
      };
    });
  };
  const createVideos = (videoIds: string[]): DetailedVideo[] => {
    return videoIds.map((element) => {
      return {
        id: element,
        custom_id: 'custom_id',
        title: `Video ${element}`,
        source_location: `source/folder/video-${element}`,
        is_archived: false,
        videos_tags: [element, 'video', 'playlist'],
        video_encoding: {
          is_protected: false,
          encoding_state: 'READY',
          output_format: 'CMAF',
          preview_status: 'APPROVED',
          audio_languages: [],
          caption_languages: [],
          subtitle_languages: [],
          video_streams: [
            {
              label: 'audio',
              file: 'audio.mp4',
              format: 'CMAF',
            },
            {
              label: 'SD',
              file: 'video.mp4',
              format: 'CMAF',
            },
          ],
        },
      };
    });
  };
  const createLocalizations = (): ChannelLocalization[] => {
    return [
      {
        is_default_locale: true,
        language_tag: 'en-US',
        title: 'source title',
        description: 'source description',
      },
      {
        is_default_locale: false,
        language_tag: 'et-EE',
        title: 'title translation',
        description: 'description translation',
      },
    ];
  };
  const createChannel = async (
    publicationState: PublicationStateEnum,
    placeholderVideoId: string | null,
    imageId: string | null,
  ): Promise<channels.JSONSelectable | undefined> => {
    return testContext.executeOwnerSql(testUser, async (txn) => {
      const channelId = uuid();
      const channel = {
        id: channelId,
        title: 'Axinom Test Channel',
        description: 'Best channel to look for testing videos.',
        publication_state: publicationState,
        published_date:
          publicationState !== 'NOT_PUBLISHED' ? new Date() : null,
        published_user:
          publicationState !== 'NOT_PUBLISHED' ? testUser.name : null,
        placeholder_video_id: placeholderVideoId,
      };
      await insert('channels', channel).run(txn);
      if (imageId) {
        await insert('channel_images', {
          channel_id: channelId,
          image_id: imageId,
          image_type: 'LOGO',
        }).run(txn);
      }
      return selectOne('channels', { id: channelId }).run(txn);
    });
  };

  beforeEach(async () => {
    jest
      .spyOn(
        getValidationAndLocalizations,
        'getChannelValidationAndLocalizations',
      )
      .mockImplementation(
        async (
          _localizationServiceBaseUrl,
          _authToken,
          _entityId,
          _entityType,
          _serviceId,
        ): Promise<{
          localizations: ChannelLocalization[];
          validations: [];
        }> => {
          return {
            localizations: createLocalizations(),
            validations: [],
          };
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
        publishChannel(
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
    expect(error).toMatchObject(CommonErrors.ChannelNotFound);
    expect(messages).toHaveLength(0);
  });

  it.each(['NOT_PUBLISHED', 'CHANGED', 'PUBLISHED', 'PUBLISHED'])(
    'error is thrown, if channel validation has errors',
    async (publicationState) => {
      // Arrange
      const channel = await createChannel(
        publicationState as PublicationStateEnum,
        null,
        null,
      );
      const publishHash = hasher.hash({
        id: channel!.id,
        title: channel!.title,
        description: channel?.description,
        images: [],
        placeholder_video: createVideos([
          '907597ec-77d7-48a0-aaee-d8bb9d733eea',
        ])[0],
        localizations: createLocalizations(),
      });
      jest
        .spyOn(validateChannelExports, 'validateChannel')
        .mockImplementation(
          async (
            _id,
            _authToken,
            _gqlClient,
            _config,
          ): Promise<PublishValidationResult<ChannelPublishedEvent>> => {
            return {
              publishHash,
              publishPayload: {
                content_id: 'channel-00bd4941-d335-4494-b4a4-249c32cef438',
                is_drm_protected: false,
                images: [],
                placeholder_video: createVideos([
                  '907597ec-77d7-48a0-aaee-d8bb9d733eea',
                ])[0],
                localizations: createLocalizations(),
              },
              validations: [
                createValidationError('Entity failed validation.', 'METADATA'),
              ],
              validationStatus: 'ERRORS',
            };
          },
        );

      // Act & Assert
      const error = await testContext.executeOwnerSql(testUser, async (txn) =>
        rejectionOf(
          publishChannel(
            channel!.id,
            publishHash,
            'jwt-bearer-token',
            'long-lived-token',
            storeOutboxMessage,
            txn,
            testContext.config,
          ),
        ),
      );
      expect(error).toMatchObject({
        ...ValidationErrors.FailedChannelPrePublishValidation,
        details: {
          errors: [
            createValidationError('Entity failed validation.', 'METADATA'),
          ],
          warnings: [],
        },
      });
      expect(messages).toHaveLength(0);

      const dbEntry = await testContext.executeOwnerSql(
        testUser,
        async (txn) => {
          return selectOne('channels', {
            id: channel?.id,
          }).run(txn);
        },
      );

      expect(dbEntry?.publication_state).toEqual(publicationState);
      expect(dbEntry?.published_date).toEqual(channel?.published_date);
      expect(dbEntry?.published_user).toEqual(channel?.published_user);
    },
  );

  it('error is thrown, if publish hash does not match hash received from validation', async () => {
    // Arrange
    const channel = await createChannel('NOT_PUBLISHED', null, null);

    // Act
    const error = await testContext.executeOwnerSql(testUser, async (txn) =>
      rejectionOf(
        publishChannel(
          channel!.id,
          'mock-hash',
          'jwt-bearer-token',
          'long-lived-token',
          storeOutboxMessage,
          txn,
          testContext.config,
        ),
      ),
    );

    // Assert
    expect(error).toMatchObject(ValidationErrors.ChannelChangedSinceValidation);
  });

  it.each(['NOT_PUBLISHED', 'CHANGED', 'PUBLISHED', 'PUBLISHED'])(
    'channel is published, if validation has only warnings',
    async (publicationState) => {
      // Arrange
      const channel = await createChannel(
        publicationState as PublicationStateEnum,
        null,
        null,
      );
      const expectedPublishedPayload: ChannelPublishedEvent = {
        content_id: `channel-${channel!.id}`,
        is_drm_protected: false,
        images: [],
        placeholder_video: createVideos([
          '907597ec-77d7-48a0-aaee-d8bb9d733eea',
        ])[0],
        localizations: createLocalizations(),
      };
      const publishHash = hasher.hash(expectedPublishedPayload);
      jest
        .spyOn(validateChannelExports, 'validateChannel')
        .mockImplementation(
          async (
            id,
            _authToken,
            _gqlClient,
            _config,
          ): Promise<PublishValidationResult<ChannelPublishedEvent>> => {
            return {
              publishHash,
              publishPayload: {
                content_id: `channel-${id}`,
                is_drm_protected: false,
                images: [],
                placeholder_video: createVideos([
                  '907597ec-77d7-48a0-aaee-d8bb9d733eea',
                ])[0],
                localizations: createLocalizations(),
              },
              validations: [
                createValidationWarning('This is a test warning.', 'METADATA'),
                createValidationWarning(
                  'This is another test warning.',
                  'METADATA',
                ),
              ],
              validationStatus: 'WARNINGS',
            };
          },
        );

      // Act
      await testContext.executeOwnerSql(testUser, async (txn) =>
        publishChannel(
          channel!.id,
          publishHash,
          'jwt-bearer-token',
          'long-lived-token',
          storeOutboxMessage,
          txn,
          testContext.config,
        ),
      );

      // Assert
      expect(messages).toHaveLength(1);
      const message = messages[0];
      expect(message.messageType).toEqual(
        ChannelServiceMessagingSettings.ChannelPublished.messageType,
      );
      const payload = message.message;
      expect(payload).toMatchObject(expectedPublishedPayload);
      const dbEntry = await testContext.executeOwnerSql(
        testUser,
        async (txn) => {
          return selectOne('channels', { id: channel?.id }).run(txn);
        },
      );
      expect(dbEntry).not.toBeNull();
      expect(dbEntry!.publication_state).toBe('PUBLISHED');
      expect(dbEntry!.published_date).not.toBeNull();
    },
  );

  it('channel is published', async () => {
    // Arrange
    const channel = await createChannel('NOT_PUBLISHED', null, null);
    const expectedPublishedPayload: ChannelPublishedEvent = {
      content_id: `channel-${channel!.id}`,
      is_drm_protected: false,
      images: [],
      placeholder_video: createVideos([
        '907597ec-77d7-48a0-aaee-d8bb9d733eea',
      ])[0],

      localizations: createLocalizations(),
    };
    const publishHash = hasher.hash(expectedPublishedPayload);
    jest
      .spyOn(validateChannelExports, 'validateChannel')
      .mockImplementation(
        async (
          id,
          _authToken,
          _gqlClient,
          _config,
        ): Promise<PublishValidationResult<ChannelPublishedEvent>> => {
          return {
            publishHash,
            publishPayload: {
              content_id: `channel-${id}`,
              is_drm_protected: false,
              images: [],
              placeholder_video: createVideos([
                '907597ec-77d7-48a0-aaee-d8bb9d733eea',
              ])[0],
              localizations: createLocalizations(),
            },
            validations: [],
            validationStatus: 'OK',
          };
        },
      );

    // Act
    await testContext.executeOwnerSql(testUser, async (txn) =>
      publishChannel(
        channel!.id,
        publishHash,
        'jwt-bearer-token',
        'long-lived-token',
        storeOutboxMessage,
        txn,
        testContext.config,
      ),
    );

    // Assert
    expect(messages).toHaveLength(1);
    const message = messages[0];
    expect(message.messageType).toEqual(
      ChannelServiceMessagingSettings.ChannelPublished.messageType,
    );
    const payload = message.message;
    expect(payload).toMatchObject(expectedPublishedPayload);
    const dbEntry = await testContext.executeOwnerSql(testUser, async (txn) => {
      return selectOne('channels', { id: channel?.id }).run(txn);
    });
    expect(dbEntry).not.toBeNull();
    expect(dbEntry!.publication_state).toBe('PUBLISHED');
    expect(dbEntry!.published_date).not.toBeNull();
  });

  it('channel is published with referenced image, video, and localizations', async () => {
    // Arrange
    const videoId = uuid();
    const imageId = uuid();
    const channel = await createChannel('NOT_PUBLISHED', videoId, imageId);

    const expectedPublishedPayload: ChannelPublishedEvent = {
      content_id: `channel-${channel!.id}`,
      is_drm_protected: false,
      images: createImages([imageId]),
      placeholder_video: createVideos([videoId])[0],
      localizations: createLocalizations(),
    };
    const publishHash = hasher.hash(expectedPublishedPayload);
    jest
      .spyOn(validateChannelExports, 'validateChannel')
      .mockImplementation(
        async (
          id,
          _authToken,
          _gqlClient,
          _config,
        ): Promise<PublishValidationResult<ChannelPublishedEvent>> => {
          return {
            publishHash,
            publishPayload: {
              content_id: `channel-${id}`,
              is_drm_protected: false,
              images: [
                {
                  height: 100,
                  id: imageId,
                  path: `test/${imageId}/image.png`,
                  type: 'test_cover',
                  width: 100,
                },
              ],
              placeholder_video: createVideos([videoId])[0],
              localizations: createLocalizations(),
            },
            validations: [],
            validationStatus: 'OK',
          };
        },
      );

    // Act
    await testContext.executeOwnerSql(testUser, async (txn) =>
      publishChannel(
        channel!.id,
        publishHash,
        'jwt-bearer-token',
        'long-lived-token',
        storeOutboxMessage,
        txn,
        testContext.config,
      ),
    );

    // Assert
    expect(messages).toHaveLength(1);
    const message = messages[0];
    expect(message.messageType).toEqual(
      ChannelServiceMessagingSettings.ChannelPublished.messageType,
    );
    const payload = message.message;
    expect(payload).toMatchObject(expectedPublishedPayload);
    const dbEntry = await testContext.executeOwnerSql(testUser, async (txn) => {
      return selectOne('channels', { id: channel?.id }).run(txn);
    });
    expect(dbEntry).not.toBeNull();
    expect(dbEntry!.publication_state).toBe('PUBLISHED');
    expect(dbEntry!.published_date).not.toBeNull();
  });
});
