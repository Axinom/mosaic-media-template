import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  PlaylistUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class PlaylistUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  PlaylistUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      ChannelServiceMessagingSettings.PlaylistUnpublished,
      new Logger({
        config,
        context: PlaylistUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<PlaylistUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('playlist', { id: payload.content_id }).run(txnClient);
  }
}
