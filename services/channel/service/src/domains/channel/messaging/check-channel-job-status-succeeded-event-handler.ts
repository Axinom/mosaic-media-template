import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CheckChannelJobStatusSucceededEvent,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { ClientBase } from 'pg';
import { selectOne, update } from 'zapatos/db';
import { Config } from '../../../common';
import { ChannelTransactionalInboxMessageHandler } from '../../../messaging';

export class CheckChannelJobStatusSucceededEventHandler extends ChannelTransactionalInboxMessageHandler<CheckChannelJobStatusSucceededEvent> {
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
    {
      payload: { channel_id, dash_stream_url, hls_stream_url },
    }: TypedTransactionalMessage<CheckChannelJobStatusSucceededEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    const id = channel_id.substring('channel-'.length);
    const dbChannel = await selectOne('channels', {
      id,
    }).run(txnClient);
    if (!dbChannel) {
      throw new MosaicError({
        message: `Channel with id ${id} not found! Failed to add links to the channel.`,
        code: 'CHANNEL_NOT_FOUND',
      });
    }
    await update(
      'channels',
      {
        dash_stream_url,
        hls_stream_url,
      },
      { id },
    ).run(txnClient);
  }
}
