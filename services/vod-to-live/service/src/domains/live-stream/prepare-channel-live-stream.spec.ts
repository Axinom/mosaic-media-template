import { Broker } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { VodToLiveServiceMessagingSettings } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { createTestVideo } from '../../tests';
import { AzureStorage } from '../azure';
import { ChannelSmilGenerator } from '../smil';
import { convertObjectToXml } from '../utils';
import { VirtualChannelApi } from '../virtual-channel';
import { prepareChannelLiveStream } from './prepare-channel-live-stream';
import { generateChannelFilePath, metadataFileName } from './utils';

describe('prepareChannelLiveStream', () => {
  let messages: {
    messageType: string;
    message: any;
  }[] = [];
  let createdVirtualChannels: { channelId: string }[] = [];
  let storedMetadata: {
    relativeFilePath: string;
    fileContent: string;
  }[] = [];
  const testChannelData = (
    isDrmProtected: boolean,
  ): { channelId: string; channelJson: string; channelSmil: string } => {
    const testChannel = {
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
      placeholder_video: createTestVideo(
        isDrmProtected,
        '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
        62,
      ),
      title: 'Discovery++',
    };
    const cpix = isDrmProtected
      ? 'https://testing.blob.core.windows.net/vod2live/cpix.smil?sv=...'
      : null;
    return {
      channelId: testChannel.id,
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
  // SMIL representing Channel with none-DRM protected content
  const mockedStorage = stub<AzureStorage>({
    createFile: async (
      relativeFilePath: string,
      fileContent: string,
    ): Promise<boolean> => {
      storedMetadata.push({ relativeFilePath, fileContent });
      return true;
    },
  });
  const mockedBroker = stub<Broker>({
    publish: (key: string, message: any) => {
      messages.push({ messageType: key, message });
    },
  });

  let channelHasPlaylistTransitionsResult: any = () => undefined;
  let getChannelsResult: any = () => undefined;
  const mockedVirtualChannelApi = stub<VirtualChannelApi>({
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
  });

  afterEach(() => {
    messages = [];
    storedMetadata = [];
    createdVirtualChannels = [];
    jest.clearAllMocks();
  });

  it.each([true, false])(
    'if virtual channel does not exist -> it will be created',
    async (isDrmProtected: boolean) => {
      // Arrange
      channelHasPlaylistTransitionsResult = () => {
        return false;
      };
      getChannelsResult = () => {
        return [];
      };
      const channelData = testChannelData(isDrmProtected);
      // Act
      await prepareChannelLiveStream(
        channelData.channelId,
        channelData.channelSmil,
        channelData.channelJson,
        mockedVirtualChannelApi,
        mockedStorage,
        mockedBroker,
        '',
      );
      // Assert
      expect(createdVirtualChannels).toHaveLength(1);
      expect(createdVirtualChannels).toMatchObject([
        { channelId: channelData.channelId },
      ]);
      expect(messages).toHaveLength(0);
      expect(storedMetadata).toHaveLength(1);
      expect(storedMetadata).toMatchObject([
        {
          relativeFilePath: generateChannelFilePath(
            channelData.channelId,
            metadataFileName,
          ),
          fileContent: channelData.channelJson,
        },
      ]);
    },
  );

  it.each([true, false])(
    'if virtual channel exist and has no playlist transitions -> channel transition is created',
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
        channelSmil,
        channelJson,
        mockedVirtualChannelApi,
        mockedStorage,
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
      expect(storedMetadata).toHaveLength(1);
      expect(storedMetadata).toMatchObject([
        {
          relativeFilePath: generateChannelFilePath(
            channelId,
            metadataFileName,
          ),
          fileContent: channelJson,
        },
      ]);
    },
  );

  it.each([true, false])(
    'if virtual channel exist and has playlist transitions -> only azure storage is updated',
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
        channelSmil,
        channelJson,
        mockedVirtualChannelApi,
        mockedStorage,
        mockedBroker,
        '',
      );
      // Assert
      expect(createdVirtualChannels).toHaveLength(0);
      expect(messages).toHaveLength(0);
      expect(storedMetadata).toHaveLength(1);
      expect(storedMetadata).toMatchObject([
        {
          relativeFilePath: generateChannelFilePath(
            channelId,
            metadataFileName,
          ),
          fileContent: channelJson,
        },
      ]);
    },
  );
});
