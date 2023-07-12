import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  CheckChannelJobStatusSucceededEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { IsolationLevel, selectOne, update } from 'zapatos/db';
import { Config } from '../../../common';
import { getChannelId } from '../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class CheckChannelJobStatusSucceededEventHandler extends AuthenticatedMessageHandler<CheckChannelJobStatusSucceededEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    protected readonly config: Config,
  ) {
    super(
      VodToLiveServiceMessagingSettings.CheckChannelJobStatusSucceeded
        .messageType,
      config,
    );
  }

  async onMessage(payload: CheckChannelJobStatusSucceededEvent): Promise<void> {
    const channelId = getChannelId(payload.channel_id);
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        const dbChannel = await selectOne('channel', {
          id: channelId,
        }).run(txnClient);
        if (!dbChannel) {
          throw new MosaicError({
            message: `Channel with id ${channelId} not found! Failed to add links to channel's live stream.`,
            code: 'CHANNEL_NOT_FOUND',
          });
        }
        await update(
          'channel',
          {
            dash_stream_url: payload.dash_stream_url,
            hls_stream_url: payload.hls_stream_url,
          },
          { id: channelId },
        ).run(txnClient);
      },
    );
  }
}