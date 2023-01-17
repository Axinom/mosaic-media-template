import { Broker } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import { VodToLiveServiceMessagingSettings } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { AzureStorage } from '../azure/azure-storage';
import { VirtualChannelApi } from '../virtual-channel';
import { deleteTransitionLiveStream } from './delete-transition-live-stream';

describe('deleteTransitionLiveStream', () => {
  let messages: {
    messageType: string;
    message: any;
  }[] = [];
  let deletedTransitions: {
    channelId: string;
    transition: string;
  }[] = [];

  const mockedStorage = stub<AzureStorage>({
    getFileContent: async (): Promise<string> => {
      return JSON.stringify({
        description: null,
        id: 'adbff5f4-fc18-4f4d-818c-91f37ba131ee',
        images: [
          {
            height: 646,
            id: 'db561b84-1e78-4f4d-9a3f-446e34db40de',
            path: '/transform/0-0/U5uZEHhwrXGde33yxwVHx9.png',
            type: 'channel_logo',
            width: 860,
          },
        ],
        placeholder_video: {
          id: '3a8e5dc9-5c91-4d61-bf95-c4e719b705f2',
          is_archived: false,
          source_file_extension: '.mp4',
          source_file_name: '1min_loop_mosaic',
          source_full_file_name: '1min_loop_mosaic.mp4',
          source_location: 'vod2live-ad-placeholder',
          source_size_in_bytes: 80788234,
          title: 'Mosaic Placeholder Video (with logo)',
          video_encoding: {
            audio_languages: ['en'],
            caption_languages: [],
            cmaf_size_in_bytes: 128070139,
            dash_manifest_path:
              'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.mpd',
            dash_size_in_bytes: null,
            length_in_seconds: 62,
            encoding_state: 'READY',
            finished_date: '2022-11-25T12:26:41.396001+00:00',
            hls_manifest_path:
              'https://test.blob.core.windows.net/video-output/8EPGt6rB2D4oJbJqb1tw3o/cmaf/manifest.m3u8',
            hls_size_in_bytes: null,
            is_protected: false,
            output_format: 'CMAF',
            output_location: '8EPGt6rB2D4oJbJqb1tw3o',
            preview_comment: null,
            preview_status: 'NOT_PREVIEWED',
            subtitle_languages: [],
            title: 'Mosaic Placeholder Video (with logo)',
            video_streams: [
              {
                bitrate_in_kbps: 2100,
                codecs: 'H264',
                display_aspect_ratio: '16:9',
                file: 'cmaf/video-H264-720-2100k-video-avc1.mp4',
                file_template: null,
                format: 'CMAF',
                frame_rate: 30,
                height: 720,
                iv: null,
                key_id: null,
                label: 'HD',
                language_code: null,
                language_name: null,
                pixel_aspect_ratio: '1:1',
                sampling_rate: null,
                type: 'VIDEO',
                width: 1280,
              },
            ],
          },
          videos_tags: ['vod2live'],
        },
        title: 'Discovery++',
      });
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
      mockedBroker,
      '',
    );

    // Assert
    expect(deletedTransitions).toHaveLength(3);
    expect(messages).toHaveLength(0);
  });

  it('if virtual channel does not have any playlist transition left -> channel transition is created', async () => {
    // Arrange
    const channelId = uuid();
    const playlistId = uuid();
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
      mockedBroker,
      '',
    );

    // Assert
    expect(deletedTransitions).toHaveLength(3);
    expect(messages).toHaveLength(1);
    expect(messages).toMatchObject([
      {
        messageType:
          VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
            .messageType,
      },
    ]);
  });
});
