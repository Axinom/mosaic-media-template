import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import {
  ChannelLocalization,
  DetailedImage,
  DetailedVideo,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { PublicationStateEnum } from 'zapatos/custom';
import { insert, selectOne } from 'zapatos/db';
import { channels } from 'zapatos/schema';
import { CommonErrors } from '../../../common';
import * as isManagedServiceEnabled from '../../../common/utils/is-managed-service-enabled';
import * as getValidationAndImages from '../../../publishing/common/image/get-validation-and-images';
import * as getValidationAndLocalizations from '../../../publishing/common/localization/get-validation-and-localizations';
import * as getValidationAndVideos from '../../../publishing/common/video/get-validation-and-videos';
import {
  createValidationError,
  createValidationWarning,
  PublishValidationMessage,
} from '../../../publishing/models';
import {
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { validateChannel } from './validate-channel';

describe('validateChannel', () => {
  let testContext: TestContext;
  let testUser: AuthenticatedManagementSubject;
  let mockGetValidationAndImages: jest.SpyInstance;
  let mockGetValidationAndVideos: jest.SpyInstance;
  let mockGetValidationAndLocalizations: jest.SpyInstance;
  const createImages = (imageIds: string[]): DetailedImage[] => {
    return imageIds.map((element) => {
      return {
        id: element,
        path: `test/${element}/image.png`,
        width: 100,
        height: 100,
        type: 'test_cover',
        alt_text: 'Some alt text',
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
    mockGetValidationAndImages = jest
      .spyOn(getValidationAndImages, 'getValidationAndImages')
      .mockImplementation(
        async (
          _imageServiceBaseUrl,
          _authToken,
          imageIds,
        ): Promise<{ images: DetailedImage[]; validations: [] }> => {
          if (imageIds.length === 0) {
            return {
              validations: [],
              images: [],
            };
          } else {
            return { images: createImages(imageIds), validations: [] };
          }
        },
      );

    mockGetValidationAndVideos = jest
      .spyOn(getValidationAndVideos, 'getValidationAndVideos')
      .mockImplementation(
        async (
          _videoServiceBaseUrl,
          _authToken,
          assignedVideos,
        ): Promise<{ videos: DetailedVideo[]; validations: [] }> => {
          if (assignedVideos.length === 0) {
            return {
              validations: [],
              videos: [],
            };
          } else {
            return {
              videos: createVideos(assignedVideos.map((v) => v.videoId)),
              validations: [],
            };
          }
        },
      );

    jest
      .spyOn(isManagedServiceEnabled, 'isManagedServiceEnabled')
      .mockImplementation(
        async (_serviceId, _idServiceBaseUrl, _authToken): Promise<boolean> => {
          return true;
        },
      );

    mockGetValidationAndLocalizations = jest
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
          validations: PublishValidationMessage[];
        }> => {
          return {
            localizations: createLocalizations(),
            validations: [],
          };
        },
      );
  });

  beforeAll(async () => {
    testContext = await createTestContext({ IS_LOCALIZATION_ENABLED: 'true' });
    testUser = createTestUser(testContext.config.serviceId);
  });

  afterAll(async () => {
    await testContext.dispose();
  });

  afterEach(async () => {
    await testContext.truncate('channels');
    jest.clearAllMocks();
  });

  it('error is thrown if channel not found in db', async () => {
    // Act
    const error = await testContext.executeOwnerSql(testUser, async (txn) =>
      rejectionOf(
        validateChannel(uuid(), 'mock-jwt-token', txn, testContext.config),
      ),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.ChannelNotFound);
  });

  it('image validations are included in validation result', async () => {
    // Arrange
    const imageId = uuid();
    const testChannel = await createChannel('NOT_PUBLISHED', null, imageId);
    mockGetValidationAndImages.mockImplementationOnce(
      async (): Promise<{
        images: DetailedImage[];
        validations: PublishValidationMessage[];
      }> => {
        return {
          images: [],
          validations: [
            createValidationError('Error Image Validation', 'IMAGES'),
            createValidationWarning('Warning Image Validation', 'IMAGES'),
          ],
        };
      },
    );

    // Act
    const { validations, validationStatus } = await testContext.executeOwnerSql(
      testUser,
      async (txn) =>
        validateChannel(
          testChannel!.id,
          'mock-jwt-token',
          txn,
          testContext.config,
        ),
    );

    // Assert
    expect(validations).toHaveLength(2);
    expect(validations).toMatchObject([
      createValidationError('Error Image Validation', 'IMAGES'),
      createValidationWarning('Warning Image Validation', 'IMAGES'),
    ]);
    expect(validationStatus).toMatch('ERRORS');
  });

  it('video validations are included in validation result', async () => {
    // Arrange
    const videoId = uuid();
    const testChannel = await createChannel('NOT_PUBLISHED', videoId, null);
    mockGetValidationAndVideos.mockImplementationOnce(
      async (): Promise<{
        videos: DetailedVideo[];
        validations: PublishValidationMessage[];
      }> => {
        return {
          videos: [],
          validations: [
            createValidationError('Error Video Validation', 'VIDEOS'),
            createValidationWarning('Warning Video Validation', 'VIDEOS'),
          ],
        };
      },
    );

    // Act
    const { validations, validationStatus } = await testContext.executeOwnerSql(
      testUser,
      async (txn) =>
        validateChannel(
          testChannel!.id,
          'mock-jwt-token',
          txn,
          testContext.config,
        ),
    );

    // Assert
    expect(validations).toHaveLength(2);
    expect(validations).toMatchObject([
      createValidationError('Error Video Validation', 'VIDEOS'),
      createValidationWarning('Warning Video Validation', 'VIDEOS'),
    ]);
    expect(validationStatus).toMatch('ERRORS');
  });

  it('localization validations are included in validation result', async () => {
    // Arrange
    const videoId = uuid();
    const testChannel = await createChannel('NOT_PUBLISHED', videoId, null);
    mockGetValidationAndLocalizations.mockImplementation(
      async (
        _localizationServiceBaseUrl,
        _authToken,
        _entityId,
        _entityType,
        _serviceId,
      ): Promise<{
        localizations: ChannelLocalization[];
        validations: PublishValidationMessage[];
      }> => {
        return {
          localizations: [],
          validations: [
            createValidationError(
              'Error Localization Validation',
              'LOCALIZATION',
            ),
            createValidationWarning(
              'Warning Localization Validation',
              'LOCALIZATION',
            ),
          ],
        };
      },
    );

    // Act
    const { validations, validationStatus } = await testContext.executeOwnerSql(
      testUser,
      async (txn) =>
        validateChannel(
          testChannel!.id,
          'mock-jwt-token',
          txn,
          testContext.config,
        ),
    );

    // Assert
    expect(validations).toHaveLength(2);
    expect(validations).toMatchObject([
      createValidationError('Error Localization Validation', 'LOCALIZATION'),
      createValidationWarning(
        'Warning Localization Validation',
        'LOCALIZATION',
      ),
    ]);
    expect(validationStatus).toMatch('ERRORS');
  });
});
