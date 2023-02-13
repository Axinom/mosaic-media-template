import axios from 'axios';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { AzureStorage } from '../azure';
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
  const mockedStorage = stub<AzureStorage>({
    deleteFolder: async (
      relativeFilePath: string,
    ): Promise<{ filePath: string; wasDeleted: boolean }[]> => {
      deletedFolders.push(relativeFilePath);
      return [];
    },
  });

  const virtualChannelApi = new VirtualChannelApi('');

  beforeEach(() => {
    deletedFolders = [];
    jest.clearAllMocks();
  });
  it('channel data is removed from API and Azure Storage', async () => {
    // Arrange
    const channelId = uuid();
    const mockedAxios = jest.mocked(axios);
    // Act
    await deleteChannelLiveStream(channelId, virtualChannelApi, mockedStorage);
    // Assert
    expect(deletedFolders).toHaveLength(1);
    expect(deletedFolders).toMatchObject([channelId]);
    expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
  });
});
