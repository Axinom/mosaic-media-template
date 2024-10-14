import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { rejectionOf } from '@axinom/mosaic-service-common';
import 'jest-extended';
import {
  ChannelLocalization,
  DetailedImage,
  DetailedVideo,
  ProgramLocalization,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { PublicationStateEnum } from 'zapatos/custom';
import { insert } from 'zapatos/db';
import { channels, playlists } from 'zapatos/schema';
import {
  AD_CUE_POINT_SCHEDULE_TYPE,
  CommonErrors,
  ValidationErrors,
  VIDEO_CUE_POINT_SCHEDULE_TYPE,
} from '../../../common';
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
import { validatePlaylist } from './validate-playlist';

describe('validatePlaylist', () => {
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
              type: 'AUDIO',
              file: 'audio.mp4',
              format: 'CMAF',
              bitrate_in_kbps: 256,
            },
            {
              label: 'SD',
              type: 'VIDEO',
              file: 'video.mp4',
              format: 'CMAF',
              width: 1920,
              height: 1080,
              frame_rate: 30,
              bitrate_in_kbps: 5000,
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
      },
      {
        is_default_locale: false,
        language_tag: 'et-EE',
        title: 'title translation',
      },
    ];
  };

  const createChannel = async (
    publicationState: PublicationStateEnum,
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
      };
      return insert('channels', channel).run(txn);
    });
  };

  const createPlaylist = async (
    channelId: string,
    publicationState: PublicationStateEnum,
  ): Promise<playlists.JSONSelectable> => {
    const startDate = new Date();
    return testContext.executeOwnerSql(testUser, async (txn) => {
      const playlist = await insert('playlists', {
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
      }).run(txn);
      const p = await insert('programs', {
        sort_index: 0,
        title: 'TEST',
        entity_id: '1',
        entity_type: 'MOVIE',
        video_duration_in_seconds: 600,
        video_id: uuid(),
        image_id: uuid(),
        playlist_id: playlist.id,
      }).run(txn);
      const cp = await insert('program_cue_points', {
        type: 'PRE',
        program_id: p.id,
      }).run(txn);

      insert('cue_point_schedules', [
        {
          sort_index: 0,
          duration_in_seconds: 10,
          program_cue_point_id: cp.id,
          type: AD_CUE_POINT_SCHEDULE_TYPE,
        },
        {
          sort_index: 1,
          duration_in_seconds: 10,
          program_cue_point_id: cp.id,
          type: VIDEO_CUE_POINT_SCHEDULE_TYPE,
          video_id: uuid(),
        },
      ]).run(txn);
      return playlist;
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
        'getProgramValidationAndLocalizations',
      )
      .mockImplementation(
        async (
          _localizationServiceBaseUrl,
          _authToken,
          _entityId,
          _entityType,
          _serviceId,
        ): Promise<{
          localizations: ProgramLocalization[];
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
    await testContext.truncate('playlists');
    jest.clearAllMocks();
  });

  it('error is thrown if channel not found in db', async () => {
    // Act
    const error = await testContext.executeOwnerSql(testUser, async (txn) =>
      rejectionOf(
        validatePlaylist(uuid(), 'mock-jwt-token', txn, testContext.config),
      ),
    );

    // Assert
    expect(error).toMatchObject(CommonErrors.PlaylistNotFound);
  });

  it.each(['NOT_PUBLISHED', 'CHANGED'])(
    'validation error is returned, if associated channel is not published for %p playlist',
    async (publishState) => {
      // Arrange
      const testChannel = await createChannel(
        publishState as PublicationStateEnum,
      );
      const testPlaylist = await createPlaylist(
        testChannel!.id,
        'NOT_PUBLISHED',
      );

      // Act
      const { validationStatus, validations } =
        await testContext.executeOwnerSql(testUser, async (txn) =>
          validatePlaylist(
            testPlaylist.id,
            'mock-jwt-token',
            txn,
            testContext.config,
          ),
        );

      // Assert
      expect(validationStatus).toBe('ERRORS');
      expect(validations).toHaveLength(1);
      expect(validations[0]).toMatchObject({
        message: ValidationErrors.AssociatedChannelNotPublished.message,
        severity: 'ERROR',
        context: 'METADATA',
      });
    },
  );

  it('image validations are included in validation result', async () => {
    // Arrange
    const testChannel = await createChannel('PUBLISHED');
    const testPlaylist = await createPlaylist(testChannel!.id, 'NOT_PUBLISHED');
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
    const { validationStatus, validations } = await testContext.executeOwnerSql(
      testUser,
      async (txn) =>
        validatePlaylist(
          testPlaylist.id,
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
    const testChannel = await createChannel('PUBLISHED');
    const testPlaylist = await createPlaylist(testChannel!.id, 'NOT_PUBLISHED');
    mockGetValidationAndVideos.mockImplementationOnce(
      async (): Promise<{
        videos: DetailedVideo[];
        validations: PublishValidationMessage[];
      }> => {
        return {
          videos: createVideos(['ff6809c1-1ce9-4200-8caa-0d7fa5d3c7c7']),
          validations: [
            createValidationError('Error Video Validation', 'VIDEOS'),
            createValidationWarning('Warning Video Validation', 'VIDEOS'),
          ],
        };
      },
    );

    // Act
    const { validationStatus, validations } = await testContext.executeOwnerSql(
      testUser,
      async (txn) =>
        validatePlaylist(
          testPlaylist.id,
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
    const testChannel = await createChannel('PUBLISHED');
    const testPlaylist = await createPlaylist(testChannel!.id, 'NOT_PUBLISHED');
    mockGetValidationAndLocalizations.mockImplementation(
      async (
        _localizationServiceBaseUrl,
        _authToken,
        _entityId,
        _entityType,
        _serviceId,
      ): Promise<{
        localizations: ProgramLocalization[];
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
    const { validationStatus, validations } = await testContext.executeOwnerSql(
      testUser,
      async (txn) =>
        validatePlaylist(
          testPlaylist.id,
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
