import axios from 'axios';
import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { AzureStorage } from '../azure';
import { VirtualChannelApi } from '../virtual-channel';
import { deleteChannelLiveStream } from './delete-channel-live-stream';
import { generateChannelStorageName } from './utils';
jest.mock('axios', () => ({
  delete: jest.fn(() => {
    return Promise.resolve({
      data: 'Virtual Channel Deleted!',
    });
  }),
}));

describe('deleteChannelLiveStream', () => {
  let deletedFiles: string[] = [];
  const mockedStorage = stub<AzureStorage>({
    deleteFile: async (relativeFilePath: string): Promise<boolean> => {
      deletedFiles.push(relativeFilePath);
      return true;
    },
  });

  const virtualChannelApi = new VirtualChannelApi('');

  beforeEach(() => {
    deletedFiles = [];
    jest.clearAllMocks();
  });
  it('channel data is removed from API and Azure Storage', async () => {
    // Arrange
    const channelId = uuid();
    const mockedAxios = jest.mocked(axios);
    // Act
    await deleteChannelLiveStream(channelId, virtualChannelApi, mockedStorage);
    // Assert
    expect(deletedFiles).toHaveLength(1);
    expect(deletedFiles).toMatchObject([generateChannelStorageName(channelId)]);
    expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
  });
});
