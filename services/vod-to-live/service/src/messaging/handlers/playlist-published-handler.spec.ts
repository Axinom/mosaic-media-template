import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { DetailedVideo, PlaylistPublishedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { Config, DAY_IN_SECONDS, SECOND_IN_MILLISECONDS } from '../../common';
import { AzureStorage, CpixSettings, KeyServiceApi } from '../../domains';
import * as cpixGeneration from '../../domains/cpix/generator/generate-cpix-settings';
import { createTestVideo } from '../../tests';
import { PlaylistPublishedHandler } from './playlist-published-handler';

describe('PlaylistPublishedHandler', () => {
  let generateCpixSettings: jest.SpyInstance;
  let cpixSettingsVideos: DetailedVideo[] = [];
  let messages: { messageType: string; message: any }[] = [];
  const mockedKeyServiceApi = stub<KeyServiceApi>({});
  const mockedAzureStorage = stub<AzureStorage>({
    getFileContent: async () => getFileContentResult(),
  });
  let getFileContentResult: any = () => undefined;

  const mockedBroker = stub<Broker>({
    publish: (key: string, message: any) => {
      messages.push({ messageType: key, message });
    },
  });

  const mockedConfig = stub<Config>({
    environment: 'test',
    serviceId: 'test-vod-to-live',
    logLevel: 'DEBUG',
    transitionProcessingTimeInMinutes: 60,
  });
  beforeEach(async () => {
    generateCpixSettings = jest
      .spyOn(cpixGeneration, 'generateCpixSettings')
      .mockImplementation(
        async (
          _channelId: string,
          _playlistId: string | null | undefined,
          decryptionParams:
            | {
                videos: DetailedVideo[];
                startDate: Date;
                durationInSeconds: number;
              }
            | null
            | undefined,
          _encryptionParams:
            | {
                startDate: Date;
                durationInSeconds: number;
              }
            | null
            | undefined,
          _storage: AzureStorage,
          _keyServiceApi: KeyServiceApi,
        ): Promise<CpixSettings> => {
          cpixSettingsVideos = decryptionParams ? decryptionParams.videos : [];
          if (cpixSettingsVideos.find((v) => v.video_encoding.is_protected)) {
            return {
              decryptionCpixFile:
                'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...',
              encryptionDashCpixFile:
                'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...',
              encryptionHlsCpixFile:
                'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...',
            };
          }
          return {
            decryptionCpixFile: undefined,
            encryptionDashCpixFile: undefined,
            encryptionHlsCpixFile: undefined,
          };
        },
      );
  });
  afterEach(() => {
    messages = [];
    cpixSettingsVideos = [];
    jest.clearAllMocks();
  });
  it.each([true, false])(
    'drm settings are generated from the channel placeholder video and videos in playlist',
    async (isDrmProtected: boolean) => {
      // Arrange
      const handler = new PlaylistPublishedHandler(
        mockedConfig,
        mockedBroker,
        mockedAzureStorage,
        mockedKeyServiceApi,
      );
      const placeholderVideo = createTestVideo(isDrmProtected, `1`, 10);
      getFileContentResult = () => {
        return JSON.stringify({
          id: uuid(),
          title: 'Test',
          placeholder_video: placeholderVideo,
        });
      };

      const programVideo = createTestVideo(isDrmProtected, '1', 600);
      const scheduleVideo = createTestVideo(isDrmProtected, '1', 10);
      const startDate = new Date();
      const payload: PlaylistPublishedEvent = {
        id: uuid(),
        channel_id: uuid(),
        start_date_time: startDate.toISOString(),
        end_date_time: new Date(
          startDate.getTime() + DAY_IN_SECONDS * SECOND_IN_MILLISECONDS,
        ).toISOString(),
        programs: [
          {
            id: uuid(),
            sort_index: 0,
            title: 'Test',
            video: programVideo,
            video_duration_in_seconds: 600,
            entity_id: uuid(),
            entity_type: 'MOVIE',
            program_cue_points: [
              {
                id: uuid(),
                type: 'PRE',
                schedules: [
                  {
                    id: uuid(),
                    sort_index: 0,
                    duration_in_seconds: 60,
                    type: 'VIDEO',
                    video: scheduleVideo,
                  },
                ],
              },
            ],
          },
        ],
      };
      const messageInfo = stub<MessageInfo<PlaylistPublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload,
        },
      });
      // Act
      await handler.onMessage(payload, messageInfo);

      // Assert
      expect(generateCpixSettings).toHaveBeenCalledTimes(1);
      expect(cpixSettingsVideos).toHaveLength(3);
      expect(cpixSettingsVideos).toMatchObject([
        placeholderVideo,
        programVideo,
        scheduleVideo,
      ]);
      expect(messages).toHaveLength(1);
    },
  );
});
