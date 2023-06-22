import axios from 'axios';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { Config } from '../../common';
import { createTestVideo } from '../../tests';
import { AzureStorage } from '../azure';
import { KeyServiceApi } from '../key-service';
import { VirtualChannelApi } from '../virtual-channel';
import { deleteChannelLiveStream } from './delete-channel-live-stream';
jest.mock('axios', () => ({
  delete: jest.fn(() => {
    return Promise.resolve({
      data: 'Virtual Channel Deleted!',
    });
  }),
}));
describe('deleteChannelLiveStream', () => {
  let deletedFolders: string[] = [];
  let deletedContentKeys: string[] = [];
  const channelId = uuid();
  const mockContentKeyId = uuid();
  const getFileContentResult: any = () => {
    return JSON.stringify({
      description: null,
      id: channelId,
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
        true,
        '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
        62,
      ),
      title: 'Discovery++',
      key_id: mockContentKeyId,
    });
  };
  const mockedStorage = stub<AzureStorage>({
    getFileContent: async () => getFileContentResult(),
    deleteFolder: async (
      relativeFilePath: string,
    ): Promise<{ filePath: string; wasDeleted: boolean }[]> => {
      deletedFolders.push(relativeFilePath);
      return [];
    },
  });

  const mockedKeyServiceApi = stub<KeyServiceApi>({
    deleteContentKey: async (contentKeyId: string): Promise<void> => {
      deletedContentKeys.push(contentKeyId);
    },
  });
  const virtualChannelApi = new VirtualChannelApi('');

  beforeEach(() => {
    deletedFolders = [];
    deletedContentKeys = [];
    jest.clearAllMocks();
  });
  it('channel metadata is removed from Azure Storage, Virtual Channel is deleted and DRM content key is deleted', async () => {
    // Arrange
    const mockedAxios = jest.mocked(axios);
    // Act
    await deleteChannelLiveStream(
      channelId,
      virtualChannelApi,
      mockedStorage,
      mockedKeyServiceApi,
      stub<Config>({ isDrmEnabled: true }),
    );
    // Assert
    expect(deletedFolders).toHaveLength(1);
    expect(deletedFolders).toMatchObject([channelId]);
    expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    expect(deletedContentKeys).toHaveLength(1);
    expect(deletedContentKeys).toMatchObject([mockContentKeyId]);
  });

  it('on channel deletion the DRM key is not removed if DRN is disabled', async () => {
    // Arrange
    const mockedAxios = jest.mocked(axios);
    // Act
    await deleteChannelLiveStream(
      channelId,
      virtualChannelApi,
      mockedStorage,
      mockedKeyServiceApi,
      stub<Config>({ isDrmEnabled: false }),
    );
    // Assert
    expect(deletedFolders).toHaveLength(1);
    expect(deletedFolders).toMatchObject([channelId]);
    expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    expect(deletedContentKeys).toHaveLength(0);
    expect(deletedContentKeys).toMatchObject([]);
  });
});
