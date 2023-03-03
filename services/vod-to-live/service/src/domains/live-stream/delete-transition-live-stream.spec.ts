/* eslint-disable jest/no-conditional-expect */
import { Broker } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { VodToLiveServiceMessagingSettings } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { createTestVideo } from '../../tests';
import { AzureStorage } from '../azure/azure-storage';
import { KeyServiceApi } from '../key-service';
import { VirtualChannelApi } from '../virtual-channel';
import { deleteTransitionLiveStream } from './delete-transition-live-stream';
import { decryptionCpixFileName, generateChannelFilePath } from './utils';

describe('deleteTransitionLiveStream', () => {
  let savedFiles: { relativeFilePath: string; fileContent: string }[] = [];
  let messages: {
    messageType: string;
    message: any;
  }[] = [];
  let deletedTransitions: {
    channelId: string;
    transition: string;
  }[] = [];

  const mockedStorage = stub<AzureStorage>({
    getFileContent: async () => getFileContentResult(),
    createFile: async (relativeFilePath: string, fileContent: string) => {
      savedFiles.push({ relativeFilePath, fileContent });
    },
  });

  let getFileContentResult: any = () => undefined;

  const createChannelJsonString = (
    channelId: string,
    isDrmProtected: boolean,
  ) => {
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
        isDrmProtected,
        '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
        62,
      ),
      title: 'Discovery++',
    });
  };

  const mockedKeyServiceApi = stub<KeyServiceApi>({
    postSpekeRequest: async (): Promise<string> => {
      return '<mocked speke response!>';
    },
  });

  let channelHasPlaylistTransitionsResult: any = () => undefined;
  const mockedVirtualChannelApi = stub<VirtualChannelApi>({
    getPlaylistTransitions: async () => {
      return [
        {
          status: 'test',
          smil: 'test 1',
          transitionDate: new Date(
            new Date().getTime() + 2 * 60000,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: 'test 2',
          transitionDate: new Date(
            new Date().getTime() + 2 * 60000,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: 'test 3',
          transitionDate: new Date(
            new Date().getTime() + 2 * 60000,
          ).toISOString(),
        },
      ];
    },
    channelHasPlaylistTransitions: async () =>
      channelHasPlaylistTransitionsResult(),
    deleteTransition: async (channelId: string, transition: string) => {
      deletedTransitions.push({ channelId, transition });
      return 'Transition was deleted !';
    },
  });

  const mockedBroker = stub<Broker>({
    publish: (key: string, message: any) => {
      messages.push({ messageType: key, message });
    },
  });
  beforeEach(() => {
    messages = [];
    savedFiles = [];
    deletedTransitions = [];
    jest.clearAllMocks();
  });

  it('all playlist transitions are deleted', async () => {
    // Arrange
    const channelId = uuid();
    const playlistId = uuid();
    // virtual channel has other playlist transitions
    channelHasPlaylistTransitionsResult = () => {
      return true;
    };
    // Act
    await deleteTransitionLiveStream(
      channelId,
      playlistId,
      mockedVirtualChannelApi,
      mockedStorage,
      mockedKeyServiceApi,
      mockedBroker,
      '',
    );

    // Assert
    expect(deletedTransitions).toHaveLength(3);
    expect(messages).toHaveLength(0);
  });

  it.each([true, false])(
    'if virtual channel does not have any playlist transition left -> channel transition is created',
    async (isDrmProtected: boolean) => {
      // Arrange
      const channelId = uuid();
      const playlistId = uuid();
      getFileContentResult = () => {
        return createChannelJsonString(channelId, isDrmProtected);
      };
      // virtual channel has other playlist transitions
      channelHasPlaylistTransitionsResult = () => {
        return false;
      };
      // Act
      await deleteTransitionLiveStream(
        channelId,
        playlistId,
        mockedVirtualChannelApi,
        mockedStorage,
        mockedKeyServiceApi,
        mockedBroker,
        '',
      );

      // Assert
      if (isDrmProtected) {
        //if video is drm protected cpix responses are saved to the storage
        expect(savedFiles).toHaveLength(1);
        expect(savedFiles).toMatchObject([
          {
            relativeFilePath: generateChannelFilePath(
              channelId,
              decryptionCpixFileName,
            ),
            fileContent: '<mocked speke response!>',
          },
        ]);
      }
      expect(deletedTransitions).toHaveLength(3);
      expect(messages).toHaveLength(1);
      expect(messages).toMatchObject([
        {
          messageType:
            VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
              .messageType,
        },
      ]);
    },
  );
});
