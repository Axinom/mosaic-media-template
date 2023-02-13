import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { ChannelPublishedEvent, DetailedVideo } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { Config } from '../../common';
import { AzureStorage, CpixSettings, KeyServiceApi } from '../../domains';
import * as cpixGeneration from '../../domains/cpix/generator/generate-cpix-settings';
import { createTestVideo } from '../../tests';
import { ChannelPublishedHandler } from './channel-published-handler';

describe('ChannelPublishedHandler', () => {
  let generateCpixSettings: jest.SpyInstance;
  let cpixSettingsVideos: DetailedVideo[] = [];
  let messages: { messageType: string; message: any }[] = [];
  const mockedKeyServiceApi = stub<KeyServiceApi>({});
  const mockedAzureStorage = stub<AzureStorage>({});

  const mockedBroker = stub<Broker>({
    publish: (key: string, message: any) => {
      messages.push({ messageType: key, message });
    },
  });

  const mockedConfig = stub<Config>({});
  beforeEach(async () => {
    generateCpixSettings = jest
      .spyOn(cpixGeneration, 'generateCpixSettings')
      .mockImplementation(
        async (videos: DetailedVideo[]): Promise<CpixSettings> => {
          cpixSettingsVideos = videos;
          if (videos.find((v) => v.video_encoding.is_protected)) {
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
    'drm settings are generated from the placeholder video',
    async (isDrmProtected: boolean) => {
      // Arrange
      const handler = new ChannelPublishedHandler(
        mockedConfig,
        mockedBroker,
        mockedKeyServiceApi,
        mockedAzureStorage,
      );
      const payload: ChannelPublishedEvent = {
        id: uuid(),
        title: 'Test',
        placeholder_video: createTestVideo(isDrmProtected, '0', 60),
      };
      const messageInfo = stub<MessageInfo<ChannelPublishedEvent>>({
        envelope: {
          auth_token: 'no-token',
          payload,
        },
      });
      // Act
      await handler.onMessage(payload, messageInfo);

      // Assert
      expect(generateCpixSettings).toHaveBeenCalledTimes(1);
      expect(cpixSettingsVideos).toHaveLength(1);
      expect(cpixSettingsVideos).toMatchObject([payload.placeholder_video]);
      expect(messages).toHaveLength(1);
    },
  );
});
