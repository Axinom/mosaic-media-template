import { stub } from 'jest-auto-stub';
import { v4 as uuid } from 'uuid';
import { MINUTE_IN_MILLISECONDS } from '../../common';
import { VirtualChannelApi } from '../virtual-channel';
import { prepareTransitionLiveStream } from './prepare-transition-live-stream';

describe('prepareTransitionLiveStream', () => {
  let createdTransitions: { channelId: string; transition: string }[] = [];
  let deletedTransitions: { channelId: string; transition: string }[] = [];
  const channelId = uuid();
  const playlistId = uuid();
  const playlistSmil = `<?xml version="1.0" encoding="UTF-8"?>
  <smil>
    <head>
      <meta name="vod2live" content="true"></meta>
      <meta name="vod2live_start_time" content="2022-11-08T12:40:15Z"></meta>
    </head>
    <body>
      <seq>
        <video src="https://usp-s3-storage.s3.eu-central-1.amazonaws.com/big-buck-bunny/big-buck-bunny_dref.mp4" clipBegin="wallclock(1970-01-01T00:00:00.00Z)" clipEnd="wallclock(1970-01-01T00:01:30.00Z)">
        </video>
      </seq>
    </body>
  </smil>`;

  let getPlaylistTransitionsResult: any = () => undefined;
  const mockedVirtualChannelApi = stub<VirtualChannelApi>({
    getPlaylistTransitions: async () => getPlaylistTransitionsResult(),

    putTransition: async (channelId: string, transition: string) => {
      createdTransitions.push({ channelId, transition });
      return {
        task_id: uuid(),
        status_url: '',
      };
    },
    deleteTransition: async (channelId: string, transition: string) => {
      deletedTransitions.push({ channelId, transition });
      return 'Transition Deleted!';
    },
  });

  afterEach(() => {
    createdTransitions = [];
    deletedTransitions = [];
    jest.clearAllMocks();
  });

  it('existing playlist transition for future dates are deleted and new transition is created', async () => {
    // Arrange
    getPlaylistTransitionsResult = () => {
      return [
        {
          status: 'test',
          smil: '',
          transitionDate: new Date(
            new Date().getTime() + 100 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: '',
          transitionDate: new Date(
            new Date().getTime() + 200 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: '',
          transitionDate: new Date(
            new Date().getTime() + 300 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
      ];
    };

    // Act
    await prepareTransitionLiveStream(
      channelId,
      playlistId,
      new Date().toISOString(),
      playlistSmil,
      mockedVirtualChannelApi,
    );
    // Assert
    expect(createdTransitions).toHaveLength(1);
    expect(deletedTransitions).toHaveLength(3);
  });

  it('existing playlist transition for past dates stay untouched and new transition is created', async () => {
    // Arrange
    getPlaylistTransitionsResult = () => {
      return [
        {
          status: 'test',
          smil: '',
          transitionDate: new Date(
            new Date().getTime() - 100 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: '',
          transitionDate: new Date(
            new Date().getTime() - 200 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
        {
          status: 'test',
          smil: '',
          transitionDate: new Date(
            new Date().getTime() - 300 * MINUTE_IN_MILLISECONDS,
          ).toISOString(),
        },
      ];
    };

    // Act
    await prepareTransitionLiveStream(
      channelId,
      playlistId,
      new Date().toISOString(),
      playlistSmil,
      mockedVirtualChannelApi,
    );
    // Assert
    expect(createdTransitions).toHaveLength(1);
    expect(deletedTransitions).toHaveLength(0);
  });

  it('if there are no existing playlist transitions new transition is created', async () => {
    // Arrange
    getPlaylistTransitionsResult = () => {
      return [];
    };
    // Act
    await prepareTransitionLiveStream(
      channelId,
      playlistId,
      new Date().toISOString(),
      playlistSmil,
      mockedVirtualChannelApi,
    );
    // Assert
    expect(createdTransitions).toHaveLength(1);
    expect(deletedTransitions).toHaveLength(0);
  });
});
