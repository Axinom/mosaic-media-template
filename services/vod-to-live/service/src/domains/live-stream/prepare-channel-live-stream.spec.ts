import { Broker } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

import {
  ChannelPublishedEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import { createTestVideo } from '../../tests';
import { AzureStorage } from '../azure';
import { convertObjectToXml } from '../common';
import { ContentKeyResponse, KeyServiceApi } from '../key-service';
import { ChannelSmilGenerator } from '../smil';
import { VirtualChannelApi } from '../virtual-channel';
import { prepareChannelLiveStream } from './prepare-channel-live-stream';
import {
  generateChannelFilePath,
  metadataFileName,
  protectionDashCpixFileName,
  protectionHlsCpixFileName,
} from './utils';

describe('prepareChannelLiveStream', () => {
  let messages: {
    messageType: string;
    message: any;
  }[] = [];
  let createdVirtualChannels: { channelId: string }[] = [];
  let createdContentKeys: { channel: string; keyId: string }[] = [];
  let filesStoredInStorage: {
    relativeFilePath: string;
    fileContent: string;
  }[] = [];
  const mockedContentKeyId = uuid();
  const testChannelData = (
    isDrmProtected: boolean,
  ): { channelId: string; channelJson: string; channelSmil: string } => {
    const testChannel: ChannelPublishedEvent = {
      content_id: `channel-${uuid()}`,
      is_drm_protected: isDrmProtected,
      images: [
        {
          height: 646,
          id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
          path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
          type: 'channel_logo',
          width: 860,
        },
      ],
      placeholder_video: createTestVideo(
        isDrmProtected,
        '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
        62,
      ),
      localizations: [
        {
          is_default_locale: true,
          language_tag: 'default',
          title: 'Discovery++',
          description: 'Discovery description',
        },
      ],
    };
    const cpix = isDrmProtected
      ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
      : null;
    return {
      channelId: testChannel.content_id,
      channelJson: JSON.stringify(testChannel),
      channelSmil: convertObjectToXml(
        new ChannelSmilGenerator({
          decryptionCpixFile: cpix,
          encryptionDashCpixFile: cpix,
          encryptionHlsCpixFile: cpix,
        }).generate(testChannel),
      ),
    };
  };
  const mockedKeyServiceApi = {
    postSpekeRequest: async (): Promise<string> => {
      return '<mocked SpekeV2 response!>';
    },
    postContentKey: async (
      contentKeyName: string,
    ): Promise<ContentKeyResponse> => {
      createdContentKeys.push({
        channel: contentKeyName,
        keyId: mockedContentKeyId,
      });
      return {
        Id: mockedContentKeyId,
        Name: contentKeyName,
        Created: new Date().toISOString(),
        Updated: new Date().toISOString(),
        CreationMethod: 1,
      };
    },
  } satisfies Partial<KeyServiceApi> as unknown as KeyServiceApi;
  // SMIL representing Channel with none-DRM protected content
  const mockedStorage = {
    getFileContent: async () => {
      return JSON.stringify({
        description: null,
        id: uuid(),
        images: [
          {
            height: 646,
            id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
            path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
            type: 'channel_logo',
            width: 860,
          },
        ],
        placeholder_video: createTestVideo(true, uuid(), 142),
        title: 'Discovery',
        key_id: mockedContentKeyId,
      });
    },
    createFile: async (
      relativeFilePath: string,
      fileContent: string,
    ): Promise<boolean> => {
      filesStoredInStorage.push({ relativeFilePath, fileContent });
      return true;
    },
  } satisfies Partial<AzureStorage> as unknown as AzureStorage;
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

  let channelHasPlaylistTransitionsResult: any = () => undefined;
  let getChannelsResult: any = () => undefined;
  const mockedVirtualChannelApi = {
    channelHasPlaylistTransitions: async () =>
      channelHasPlaylistTransitionsResult(),
    getChannels: async () => getChannelsResult(),
    putChannel: async (channelId: string) => {
      createdVirtualChannels.push({ channelId });
      return {
        task_id: uuid(),
        status_url: '',
      };
    },
  } satisfies Partial<VirtualChannelApi> as unknown as VirtualChannelApi;

  afterEach(() => {
    messages = [];
    filesStoredInStorage = [];
    createdVirtualChannels = [];
    createdContentKeys = [];
  });

  it('if virtual channel with DRM does not exist -> it will be created', async () => {
    // Arrange
    channelHasPlaylistTransitionsResult = () => {
      return false;
    };
    getChannelsResult = () => {
      return [];
    };
    const { channelId, channelJson, channelSmil } = testChannelData(true);

    // Act
    await prepareChannelLiveStream(
      channelId,
      true,
      channelSmil,
      channelJson,
      mockedVirtualChannelApi,
      mockedStorage,
      mockedKeyServiceApi,
      mockedBroker,
      '',
    );
    // Assert
    expect(createdVirtualChannels).toHaveLength(1);
    expect(createdVirtualChannels).toMatchObject([{ channelId: channelId }]);
    expect(messages).toHaveLength(2);
    expect(messages).toMatchObject([
      {
        messageType:
          VodToLiveServiceMessagingSettings.LiveStreamProtectionKeyCreated
            .messageType,
        message: {
          channel_id: channelId,
          key_id: mockedContentKeyId,
        },
      },
      {
        message: {
          channel_id: channelId,
          seconds_elapsed_while_waiting: 0,
        },
        messageType:
          VodToLiveServiceMessagingSettings.CheckChannelJobStatus.messageType,
      },
    ]);
    expect(createdContentKeys).toHaveLength(1);
    expect(createdContentKeys).toMatchObject([
      { channel: channelId, keyId: mockedContentKeyId },
    ]);
    expect(filesStoredInStorage).toHaveLength(3);
    const channelMetadata = {
      ...JSON.parse(channelJson),
      key_id: mockedContentKeyId,
    };
    expect(filesStoredInStorage).toMatchObject([
      {
        relativeFilePath: generateChannelFilePath(
          channelId,
          protectionHlsCpixFileName,
        ),
        fileContent: '<mocked SpekeV2 response!>',
      },
      {
        relativeFilePath: generateChannelFilePath(
          channelId,
          protectionDashCpixFileName,
        ),
        fileContent: '<mocked SpekeV2 response!>',
      },
      {
        relativeFilePath: generateChannelFilePath(channelId, metadataFileName),
        fileContent: JSON.stringify(channelMetadata),
      },
    ]);
  });

  it.each([true, false])(
    'if virtual channel exist and has no playlist transitions -> channel transition is created (DRM: %p)',
    async (isDrmProtected: boolean) => {
      // Arrange
      channelHasPlaylistTransitionsResult = () => {
        return false;
      };
      const { channelId, channelJson, channelSmil } =
        testChannelData(isDrmProtected);
      getChannelsResult = () => {
        return [{ name: channelId, uri: '' }];
      };

      // Act
      await prepareChannelLiveStream(
        channelId,
        isDrmProtected,
        channelSmil,
        channelJson,
        mockedVirtualChannelApi,
        mockedStorage,
        mockedKeyServiceApi,
        mockedBroker,
        '',
      );
      // Assert
      expect(createdVirtualChannels).toHaveLength(0);
      expect(messages).toHaveLength(1);
      expect(messages).toMatchObject([
        {
          messageType:
            VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
              .messageType,
          message: {
            channel_id: channelId,
            playlist_id: channelId,
            smil: channelSmil,
          },
        },
      ]);
      expect(createdContentKeys).toHaveLength(0); // no new key ids were requested
      const channelMetadata = {
        ...JSON.parse(channelJson),
        key_id: isDrmProtected ? mockedContentKeyId : undefined,
      };

      expect(filesStoredInStorage).toHaveLength(1);
      expect(filesStoredInStorage).toMatchObject([
        {
          relativeFilePath: generateChannelFilePath(
            channelId,
            metadataFileName,
          ),
          fileContent: JSON.stringify(channelMetadata),
        },
      ]);
    },
  );

  it.each([true, false])(
    'if virtual channel exist and has playlist transitions -> only azure storage is updated (DRM: %p)',
    async (isDrmProtected: boolean) => {
      // Arrange
      channelHasPlaylistTransitionsResult = () => {
        return true;
      };
      const { channelId, channelJson, channelSmil } =
        testChannelData(isDrmProtected);
      getChannelsResult = () => {
        return [{ name: channelId, uri: '' }];
      };

      // Act
      await prepareChannelLiveStream(
        channelId,
        isDrmProtected,
        channelSmil,
        channelJson,
        mockedVirtualChannelApi,
        mockedStorage,
        mockedKeyServiceApi,
        mockedBroker,
        '',
      );
      // Assert
      expect(createdVirtualChannels).toHaveLength(0);
      expect(messages).toHaveLength(0);

      expect(createdContentKeys).toHaveLength(0); // no new key ids were requested
      const channelMetadata = {
        ...JSON.parse(channelJson),
        key_id: isDrmProtected ? mockedContentKeyId : undefined,
      };

      expect(filesStoredInStorage).toHaveLength(1);
      expect(filesStoredInStorage).toMatchObject([
        {
          relativeFilePath: generateChannelFilePath(
            channelId,
            metadataFileName,
          ),
          fileContent: JSON.stringify(channelMetadata),
        },
      ]);
    },
  );

  it('if virtual channel without DRM does not exist -> it will be created', async () => {
    // Arrange
    channelHasPlaylistTransitionsResult = () => {
      return false;
    };
    getChannelsResult = () => {
      return [];
    };
    const channelData = testChannelData(false);
    // Act
    await prepareChannelLiveStream(
      channelData.channelId,
      false,
      channelData.channelSmil,
      channelData.channelJson,
      mockedVirtualChannelApi,
      mockedStorage,
      mockedKeyServiceApi,
      mockedBroker,
      '',
    );
    // Assert
    expect(createdVirtualChannels).toHaveLength(1);
    expect(createdVirtualChannels).toMatchObject([
      { channelId: channelData.channelId },
    ]);
    expect(messages).toHaveLength(1);
    expect(messages).toMatchObject([
      {
        message: {
          channel_id: channelData.channelId,
          seconds_elapsed_while_waiting: 0,
        },
        messageType:
          VodToLiveServiceMessagingSettings.CheckChannelJobStatus.messageType,
      },
    ]);

    expect(createdContentKeys).toHaveLength(0);

    const channelMetadata = JSON.parse(channelData.channelJson);

    expect(filesStoredInStorage).toHaveLength(1);
    expect(filesStoredInStorage).toMatchObject([
      {
        relativeFilePath: generateChannelFilePath(
          channelData.channelId,
          metadataFileName,
        ),
        fileContent: JSON.stringify(channelMetadata),
      },
    ]);
  });
});
