import {
  ChannelServiceMultiTenantMessagingSettings,
  ChannelUnpublishedEvent,
} from '@axinom/mosaic-messages';
import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';
import { getChannelId } from '../common';
import { ChannelGuardedTransactionalMessageHandler } from './channel-guarded-transactional-message-handler';

export class ChannelUnpublishedEventHandler extends ChannelGuardedTransactionalMessageHandler<ChannelUnpublishedEvent> {
  constructor(config: Config) {
    super(
      ChannelServiceMultiTenantMessagingSettings.ChannelUnpublished,
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
    const channelId = getChannelId(payload.id);
    await db.deletes('channel', { id: channelId }).run(txnClient);
  }
}
