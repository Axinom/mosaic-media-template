import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckChannelJobStatusSucceededEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { selectOne, update } from 'zapatos/db';
import { Config } from '../../../common';
import { getChannelId } from '../common';
import { ChannelGuardedTransactionalMessageHandler } from './channel-guarded-transactional-message-handler';

export class CheckChannelJobStatusSucceededEventHandler extends ChannelGuardedTransactionalMessageHandler<CheckChannelJobStatusSucceededEvent> {
  constructor(config: Config) {
    super(
      VodToLiveServiceMessagingSettings.CheckChannelJobStatusSucceeded,
      new Logger({
        config,
        context: CheckChannelJobStatusSucceededEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<CheckChannelJobStatusSucceededEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    const channelId = getChannelId(payload.channel_id);
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
  }
}
