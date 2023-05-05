import { LoginPgPool, transactionWithContext } from '@axinom/mosaic-db-common';
import {
  EnsureChannelLiveReadyEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { IsolationLevel, update } from 'zapatos/db';
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
