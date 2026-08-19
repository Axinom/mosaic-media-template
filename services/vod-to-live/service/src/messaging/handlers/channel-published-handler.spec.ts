import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

import { ChannelPublishedEvent, DetailedVideo } from 'media-messages';
import { v4 as uuid } from 'uuid';
import type { MockInstance } from 'vitest';
import { vi } from 'vitest';
import { Config } from '../../common';
import { AzureStorage, KeyServiceApi } from '../../domains';
import * as cpixGeneration from '../../domains/cpix/generator/generate-cpix-settings';
import { createTestVideo } from '../../tests';
import { ChannelPublishedHandler } from './channel-published-handler';

describe('ChannelPublishedHandler', () => {
  let createDecryptionCpix: MockInstance;
  let cpixSettingsVideos: DetailedVideo[] = [];
  let messages: { messageType: string; message: any }[] = [];
  const mockedKeyServiceApi =
    {} satisfies Partial<KeyServiceApi> as unknown as KeyServiceApi;
  const mockedAzureStorage =
    {} satisfies Partial<AzureStorage> as unknown as AzureStorage;
  const mockedBroker = {
    publish: vi.fn<Broker['publish']>(
      async (
        _id: string,
        { messageType }: MessagingSettings,
        message: unknown,
      ) => {
        messages.push({ messageType, message });
        return {} as Awaited<ReturnType<Broker['publish']>>;
      },
    ),
  } satisfies Partial<Broker> as unknown as Broker;

  const mockedConfig = {} satisfies Partial<Config> as unknown as Config;
  beforeEach(async () => {
    createDecryptionCpix = vi
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
    vi.restoreAllMocks();
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
        content_id: `channel-${uuid()}`,
        is_drm_protected: isDrmProtected,
        images: [],
        placeholder_video: createTestVideo(isDrmProtected, '0', 60),
        localizations: [
          {
            is_default_locale: true,
            language_tag: 'default',
            title: 'Test',
            description: null,
          },
        ],
      };
      const messageInfo = {
        envelope: {
          auth_token: 'no-token',
          payload,
        },
      } satisfies Partial<
        Omit<MessageInfo<ChannelPublishedEvent>, 'envelope'>
      > & {
        envelope: Partial<MessageInfo<ChannelPublishedEvent>['envelope']>;
      } as unknown as MessageInfo<ChannelPublishedEvent>;
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
