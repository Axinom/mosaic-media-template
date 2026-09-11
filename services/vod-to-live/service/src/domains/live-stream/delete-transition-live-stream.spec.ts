/* eslint-disable vitest/no-conditional-expect */
import { Broker } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

import { VodToLiveServiceMessagingSettings } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { MINUTE_IN_MILLISECONDS } from '../../common';
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

  const mockedStorage = {
    getFileContent: async () => getFileContentResult(),
    createFile: async (relativeFilePath: string, fileContent: string) => {
      savedFiles.push({ relativeFilePath, fileContent });
      return true;
    },
    deleteFolder: vi.fn<AzureStorage['deleteFolder']>().mockResolvedValue([]),
    getFileSasUrl: vi
      .fn<AzureStorage['getFileSasUrl']>()
      .mockResolvedValue('https://example.test/decryption.cpix'),
  } satisfies Partial<AzureStorage> as unknown as AzureStorage;

  let getFileContentResult: any = () => undefined;

  const createChannelJsonString = (
    channelId: string,
    isDrmProtected: boolean,
  ) => {
    return JSON.stringify({
      content_id: channelId,
      title: 'Discovery++',
      description: null,
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
    });
  };

  const mockedKeyServiceApi = {
    postSpekeRequest: async (): Promise<string> => {
      return '<mocked speke response!>';
    },
  } satisfies Partial<KeyServiceApi> as unknown as KeyServiceApi;

  let channelHasPlaylistTransitionsResult: any = () => undefined;
  const mockedVirtualChannelApi = {
    getPlaylistTransitions: async () => {
      return [
        {
          status: 'test',
          smil: 'test 1',
          transitionDate: new Date(
            new Date().getTime() + 2 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: 'test 2',
          transitionDate: new Date(
            new Date().getTime() + 2 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: 'test 3',
          transitionDate: new Date(
            new Date().getTime() + 2 * MINUTE_IN_MILLISECONDS,
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
  } satisfies Partial<VirtualChannelApi> as unknown as VirtualChannelApi;

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
  beforeEach(() => {
    messages = [];
    savedFiles = [];
    deletedTransitions = [];
  });

  it('all playlist transitions are deleted', async () => {
    // Arrange
    const channelId = `channel-${uuid()}`;
    const playlistId = `playlist-${uuid()}`;
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
      const channelId = `channel-${uuid()}`;
      const playlistId = `playlist-${uuid()}`;
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
        // if video is drm protected cpix responses are saved to the storage
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
