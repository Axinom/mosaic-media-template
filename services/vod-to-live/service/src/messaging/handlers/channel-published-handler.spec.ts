import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { ChannelPublishedEvent, DetailedVideo } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { Config } from '../../common';
import { AzureStorage, KeyServiceApi } from '../../domains';
import * as cpixGeneration from '../../domains/cpix/generator/generate-cpix-settings';
import { createTestVideo } from '../../tests';
import { ChannelPublishedHandler } from './channel-published-handler';

describe('ChannelPublishedHandler', () => {
  let createDecryptionCpix: jest.SpyInstance;
  let cpixSettingsVideos: DetailedVideo[] = [];
  let messages: { messageType: string; message: any }[] = [];
  const mockedKeyServiceApi = stub<KeyServiceApi>({});
  const mockedAzureStorage = stub<AzureStorage>({});
  const mockedBroker = stub<Broker>({
    publish: (
      _id: string,
      { messageType }: MessagingSettings,
      message: unknown,
    ) => {
      messages.push({ messageType, message });
    },
  });

  const mockedConfig = stub<Config>({});
  beforeEach(async () => {
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
      expect(createDecryptionCpix).toHaveBeenCalledTimes(1);
      expect(cpixSettingsVideos).toHaveLength(1);
      expect(cpixSettingsVideos).toMatchObject([payload.placeholder_video]);
      expect(messages).toHaveLength(1);
    },
  );
});
