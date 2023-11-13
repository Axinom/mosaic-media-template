import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { DetailedVideo, PlaylistPublishedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { Config, DAY_IN_SECONDS, SECOND_IN_MILLISECONDS } from '../../common';
import { AzureStorage, KeyServiceApi } from '../../domains';
import * as cpixGeneration from '../../domains/cpix/generator/generate-cpix-settings';
import { createTestVideo } from '../../tests';
import { PlaylistPublishedHandler } from './playlist-published-handler';

describe('PlaylistPublishedHandler', () => {
  let createEncryptionCpix: jest.SpyInstance;
  let createDecryptionCpix: jest.SpyInstance;
  let cpixSettingsVideos: DetailedVideo[] = [];
  let messages: { messageType: string; message: any }[] = [];
  const mockedKeyServiceApi = stub<KeyServiceApi>({});
  const mockedAzureStorage = stub<AzureStorage>({
    getFileContent: async () => getFileContentResult(),
  });
  let getFileContentResult: any = () => undefined;

  const mockedBroker = stub<Broker>({
    publish: (
      _id: string,
      { messageType }: MessagingSettings,
      message: unknown,
    ) => {
      messages.push({ messageType, message });
    },
  });

  const mockedConfig = stub<Config>({
    environment: 'test',
    serviceId: 'test-vod-to-live',
    logLevel: 'DEBUG',
    catchUpDurationInMinutes: 60,
    isDrmEnabled: false,
  });
  beforeEach(async () => {
    createEncryptionCpix = jest
      .spyOn(cpixGeneration, 'createEncryptionCpix')
      .mockImplementation(
        async (
          _channelId: string,
          _encryptionType: 'DASH' | 'HLS',
          encryptionParams:
            | {
                startDate: Date;
                durationInSeconds: number;
              }
            | null
            | undefined,
          _storage: AzureStorage,
        ): Promise<string | undefined> => {
          if (encryptionParams) {
            return 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...';
          }
          return undefined;
        },
      );

    createDecryptionCpix = jest
      .spyOn(cpixGeneration, 'createDecryptionCpix')
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
          _storage: AzureStorage,
          _keyServiceApi: KeyServiceApi,
        ): Promise<string | undefined> => {
          cpixSettingsVideos = decryptionParams ? decryptionParams.videos : [];
          if (decryptionParams) {
            if (cpixSettingsVideos.find((v) => v.video_encoding.is_protected)) {
              return 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...';
            } else {
              return undefined;
            }
          }
          return undefined;
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
      expect(createDecryptionCpix).toHaveBeenCalledTimes(1);
      expect(createEncryptionCpix).toHaveBeenCalledTimes(2);
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
