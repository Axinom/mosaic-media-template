import type * as MosaicServiceCommon from '@axinom/mosaic-service-common';
import { vi } from 'vitest';

vi.mock('@axinom/mosaic-service-common', async () => {
  const original = await vi.importActual<typeof MosaicServiceCommon>(
    '@axinom/mosaic-service-common',
  );
  return {
    ...original,
    sleep: vi.fn(),
  };
});

import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { sleep } from '@axinom/mosaic-service-common';
import {
  CheckChannelJobStatusCommand,
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
import { CheckChannelJobStatusHandler } from './check-channel-job-status-handler';

describe('CheckChannelJobStatusHandler', () => {
  let messages: { messageType: string; message: any }[] = [];

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

  const mockedConfig = {
    environment: 'test',
    serviceId: 'test-vod-to-live',
    logLevel: 'DEBUG',

    virtualChannelOriginBaseUrl: 'https://axinom-test-origin.com/',
    channelProcessingWaitTimeInSeconds: 10,
  } satisfies Partial<Config> as unknown as Config;
  let getChannelStatusResult = (): ChannelStatusResponse => {
    return {
      status: 'Pending',
      origin_url: 'https://axinom-test-origin.com/',
      details: [],
    };
  };
  const mockedVirtualChannelApi = {
    getChannelStatus: async (): Promise<ChannelStatusResponse> =>
      getChannelStatusResult(),
  } satisfies Partial<VirtualChannelApi> as unknown as VirtualChannelApi;
  const handler = new CheckChannelJobStatusHandler(
    mockedConfig,
    mockedVirtualChannelApi,
    mockedBroker,
  );

  beforeAll(() => {
    vi.mocked(sleep).mockImplementation(async () => {
      return;
    });
  });
  afterEach(() => {
    messages = [];
  });

  it.each(['Pending', 'In Progress'])(
    'if virtual channel status is "%s" -> CheckChannelJobStatusCommand is sent',
    async (status) => {
      // Arrange
      getChannelStatusResult = () => {
        return {
          status: status as ChannelStatus,
          origin_url: 'https://axinom-test-origin.com/',
          details: [],
        };
      };
      const payload: CheckChannelJobStatusCommand = {
        channel_id: uuid(),
        seconds_elapsed_while_waiting: 0,
      };
      const messageInfo = {
        envelope: {
          auth_token: 'no-token',
          payload,
        },
      } satisfies Partial<
        Omit<MessageInfo<CheckChannelJobStatusCommand>, 'envelope'>
      > & {
        envelope: Partial<
          MessageInfo<CheckChannelJobStatusCommand>['envelope']
        >;
      } as unknown as MessageInfo<CheckChannelJobStatusCommand>;
      // Act
      await handler.onMessage(payload, messageInfo);
      // Assert
      expect(messages).toHaveLength(1);
      expect(messages).toMatchObject([
        {
          messageType:
            VodToLiveServiceMessagingSettings.CheckChannelJobStatus.messageType,
          message: {
            channel_id: payload.channel_id,
            seconds_elapsed_while_waiting: 5,
          },
        },
      ]);
    },
  );

  it('if virtual channel status is "Success" -> CheckChannelJobStatusSucceededEvent is sent', async () => {
    // Arrange
    getChannelStatusResult = () => {
      return {
        status: 'Success',
        origin_url: 'https://axinom-test-origin.com/',
        details: [],
      };
    };
    const payload: CheckChannelJobStatusCommand = {
      channel_id: uuid(),
      seconds_elapsed_while_waiting: 0,
    };
    const messageInfo = {
      envelope: {
        auth_token: 'no-token',
        payload,
      },
    } satisfies Partial<
      Omit<MessageInfo<CheckChannelJobStatusCommand>, 'envelope'>
    > & {
      envelope: Partial<MessageInfo<CheckChannelJobStatusCommand>['envelope']>;
    } as unknown as MessageInfo<CheckChannelJobStatusCommand>;
    // Act
    await handler.onMessage(payload, messageInfo);
    // Assert
    expect(messages).toHaveLength(1);
    expect(messages).toMatchObject([
      {
        messageType:
          VodToLiveServiceMessagingSettings.CheckChannelJobStatusSucceeded
            .messageType,
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

  it('if virtual channel status is "Failed" -> CheckChannelJobStatusFailedEvent is sent', async () => {
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
    const payload: CheckChannelJobStatusCommand = {
      channel_id: uuid(),
      seconds_elapsed_while_waiting: 0,
    };
    const messageInfo = {
      envelope: {
        auth_token: 'no-token',
        payload,
      },
    } satisfies Partial<
      Omit<MessageInfo<CheckChannelJobStatusCommand>, 'envelope'>
    > & {
      envelope: Partial<MessageInfo<CheckChannelJobStatusCommand>['envelope']>;
    } as unknown as MessageInfo<CheckChannelJobStatusCommand>;
    // Act
    await handler.onMessage(payload, messageInfo);
    // Assert
    expect(messages).toHaveLength(1);
    expect(messages).toMatchObject([
      {
        messageType:
          VodToLiveServiceMessagingSettings.CheckChannelJobStatusFailed
            .messageType,
        message: {
          channel_id: payload.channel_id,
          message:
            'Failed task: Task 2. Details: Failed to execute step 4 of the task.',
        },
      },
    ]);
  });

  it.each([10, 25])(
    'if "seconds_elapsed_while_waiting"(%s) is equal or larger than configured wait time -> CheckChannelJobStatusFailedEvent is sent',
    async (secondsWithoutProgress) => {
      // Arrange
      getChannelStatusResult = () => {
        return {
          status: 'Pending',
          origin_url: 'https://axinom-test-origin.com/',
          details: [],
        };
      };
      const payload: CheckChannelJobStatusCommand = {
        channel_id: uuid(),
        seconds_elapsed_while_waiting: secondsWithoutProgress,
      };
      const messageInfo = {
        envelope: {
          auth_token: 'no-token',
          payload,
        },
      } satisfies Partial<
        Omit<MessageInfo<CheckChannelJobStatusCommand>, 'envelope'>
      > & {
        envelope: Partial<
          MessageInfo<CheckChannelJobStatusCommand>['envelope']
        >;
      } as unknown as MessageInfo<CheckChannelJobStatusCommand>;
      // Act
      await handler.onMessage(payload, messageInfo);
      // Assert
      expect(messages).toHaveLength(1);
      expect(messages).toMatchObject([
        {
          messageType:
            VodToLiveServiceMessagingSettings.CheckChannelJobStatusFailed
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
