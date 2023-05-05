import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { sleep } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import {
  EnsureChannelLiveCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import urljoin from 'url-join';
import { v4 as uuid } from 'uuid';
import { Config } from '../../common';
import {
  ChannelStatus,
  ChannelStatusResponse,
  VirtualChannelApi,
} from '../../domains';
import { EnsureChannelLiveHandler } from './ensure-channel-live-handler';
jest.mock('@axinom/mosaic-service-common', () => {
  const original = jest.requireActual('@axinom/mosaic-service-common');
  return {
    ...original,
    sleep: jest.fn(),
  };
});
describe('EnsureChannelLiveHandler', () => {
  let messages: { messageType: string; message: any }[] = [];

  const mockedBroker = stub<Broker>({
    publish: (key: string, message: any) => {
      messages.push({ messageType: key, message });
    },
  });

  const mockedConfig = stub<Config>({
    environment: 'test',
    serviceId: 'test-vod-to-live',
    logLevel: 'DEBUG',

    virtualChannelOriginBaseUrl: 'https://axinom-test-origin.com/',
    channelProcessingWaitTimeInSeconds: 10,
  });
  let getChannelStatusResult = (): ChannelStatusResponse => {
    return {
      status: 'Pending',
      origin_url: 'https://axinom-test-origin.com/',
      details: [],
    };
  };
  const mockedVirtualChannelApi = stub<VirtualChannelApi>({
    getChannelStatus: async (): Promise<ChannelStatusResponse> =>
      getChannelStatusResult(),
  });
  const handler = new EnsureChannelLiveHandler(
    mockedConfig,
    mockedVirtualChannelApi,
    mockedBroker,
  );

  beforeAll(() => {
    (sleep as jest.Mock<any, any>).mockImplementation(async (ms) => {
      return;
    });
  });
  afterEach(() => {
    messages = [];
    jest.clearAllMocks();
  });

  it.each(['Pending', 'In Progress'])(
    'if virtual channel status is "%s" -> EnsureChannelLiveCommand is sent',
    async (status) => {
      // Arrange
      getChannelStatusResult = () => {
        return {
          status: status as ChannelStatus,
          origin_url: 'https://axinom-test-origin.com/',
          details: [],
        };
      };
      const payload: EnsureChannelLiveCommand = {
        channel_id: uuid(),
        seconds_elapsed_while_waiting: 0,
      };
      const messageInfo = stub<MessageInfo<EnsureChannelLiveCommand>>({
        envelope: {
          auth_token: 'no-token',
          payload,
        },
      });
      // Act
      await handler.onMessage(payload, messageInfo);
      // Assert
      expect(messages).toHaveLength(1);
      expect(messages).toMatchObject([
        {
          messageType:
            VodToLiveServiceMessagingSettings.EnsureChannelLive.messageType,
          message: {
            channel_id: payload.channel_id,
            seconds_elapsed_while_waiting: 5,
          },
        },
      ]);
    },
  );

  it('if virtual channel status is "Success" -> EnsureChannelLiveReadyEvent is sent', async () => {
    // Arrange
    getChannelStatusResult = () => {
      return {
        status: 'Success',
        origin_url: 'https://axinom-test-origin.com/',
        details: [],
      };
    };
    const payload: EnsureChannelLiveCommand = {
      channel_id: uuid(),
      seconds_elapsed_while_waiting: 0,
    };
    const messageInfo = stub<MessageInfo<EnsureChannelLiveCommand>>({
      envelope: {
        auth_token: 'no-token',
        payload,
      },
    });
    // Act
    await handler.onMessage(payload, messageInfo);
    // Assert
    expect(messages).toHaveLength(1);
    expect(messages).toMatchObject([
      {
        messageType:
          VodToLiveServiceMessagingSettings.EnsureChannelLiveReady.messageType,
        message: {
          channel_id: payload.channel_id,
          dash_stream_url: urljoin(
            'https://axinom-test-origin.com/',
            `${payload.channel_id}.isml`,
            '.mpd',
          ),
          hls_stream_url: urljoin(
            'https://axinom-test-origin.com/',
            `${payload.channel_id}.isml`,
            '.m3u8',
          ),
        },
      },
    ]);
  });

  it('if virtual channel status is "Failed" -> EnsureChannelLiveFailedEvent is sent', async () => {
    // Arrange
    getChannelStatusResult = () => {
      return {
        status: 'Failed',
        origin_url: 'https://axinom-test-origin.com/',
        details: [
          {
            status: 'Success',
            name: 'Task 1',
            details: '',
            time: '',
          },
          {
            time: '',
            status: 'Failed',
            name: 'Task 2',
            details: 'Failed to execute step 4 of the task.',
          },
        ],
      };
    };
    const payload: EnsureChannelLiveCommand = {
      channel_id: uuid(),
      seconds_elapsed_while_waiting: 0,
    };
    const messageInfo = stub<MessageInfo<EnsureChannelLiveCommand>>({
      envelope: {
        auth_token: 'no-token',
        payload,
      },
    });
    // Act
    await handler.onMessage(payload, messageInfo);
    // Assert
    expect(messages).toHaveLength(1);
    expect(messages).toMatchObject([
      {
        messageType:
          VodToLiveServiceMessagingSettings.EnsureChannelLiveFailed.messageType,
        message: {
          channel_id: payload.channel_id,
          message:
            'Failed task: Task 2. Details: Failed to execute step 4 of the task.',
        },
      },
    ]);
  });

  it.each([10, 25])(
    'if "seconds_elapsed_while_waiting"(%s) is equal or larger than configured wait time -> EnsureChannelLiveFailedEvent is sent',
    async (secondsWithoutProgress) => {
      // Arrange
      getChannelStatusResult = () => {
        return {
          status: 'Pending',
          origin_url: 'https://axinom-test-origin.com/',
          details: [],
        };
      };
      const payload: EnsureChannelLiveCommand = {
        channel_id: uuid(),
        seconds_elapsed_while_waiting: secondsWithoutProgress,
      };
      const messageInfo = stub<MessageInfo<EnsureChannelLiveCommand>>({
        envelope: {
          auth_token: 'no-token',
          payload,
        },
      });
      // Act
      await handler.onMessage(payload, messageInfo);
      // Assert
      expect(messages).toHaveLength(1);
      expect(messages).toMatchObject([
        {
          messageType:
            VodToLiveServiceMessagingSettings.EnsureChannelLiveFailed
              .messageType,
          message: {
            channel_id: payload.channel_id,
            message: `The channel ${payload.channel_id} has taken more than 10 seconds to go live.`,
          },
        },
      ]);
    },
  );
});
