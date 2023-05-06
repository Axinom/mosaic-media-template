import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  EnsureChannelLiveReadyEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { IsolationLevel, selectOne, update } from 'zapatos/db';
import { Config } from '../../../common';
import { AuthenticatedMessageHandler } from './authenticated-message-handler';

export class EnsureChannelLiveReadyEventHandler extends AuthenticatedMessageHandler<EnsureChannelLiveReadyEvent> {
  constructor(
    private readonly loginPool: LoginPgPool,
    protected readonly config: Config,
  ) {
    super(
      VodToLiveServiceMessagingSettings.EnsureChannelLiveReady.messageType,
      config,
    );
  }

  async onMessage(payload: EnsureChannelLiveReadyEvent): Promise<void> {
    await transactionWithContext(
      this.loginPool,
      IsolationLevel.Serializable,
      { role: this.config.dbGqlRole },
      async (txnClient) => {
        const dbChannel = await selectOne('channel', {
          id: payload.channel_id,
        }).run(txnClient);
        if (!dbChannel) {
          throw new MosaicError({
            message: `Channel with id ${payload.channel_id} not found! Failed to add links to channel's live stream.`,
            code: 'CHANNEL_NOT_FOUND',
          });
        }
        await update(
          'channel',
          {
            dash_stream_url: payload.dash_stream_url,
            hls_stream_url: payload.hls_stream_url,
          },
          { id: payload.channel_id },
        ).run(txnClient);
      },
    );
  }
}
