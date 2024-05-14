import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  ChannelServiceMessagingSettings,
  ChannelUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';

export class ChannelUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  ChannelUnpublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      ChannelServiceMessagingSettings.ChannelUnpublished,
      new Logger({
        config,
        context: ChannelUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<ChannelUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('channel', { id: payload.content_id }).run(txnClient);
  }
}
