import { Logger } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
  UNKNOWN_AGGREGATE_ID,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CatalogServiceMessagingSettings,
  EntityPublishSuccessEvent,
  PublishServiceMessagingSettings,
  SeasonUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';
import { requestServiceAccountToken } from '../../../common/utils/token-utils';

export class SeasonUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  SeasonUnpublishedEvent,
  Config
> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config
  ) {
    super(
      PublishServiceMessagingSettings.SeasonUnpublished,
      new Logger({
        config,
        context: SeasonUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<SeasonUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('season', { id: payload.content_id }).run(txnClient);

    const accessToken = await requestServiceAccountToken(this.config);
        await this.storeOutboxMessage<EntityPublishSuccessEvent>(
          payload.content_id ? payload.content_id : UNKNOWN_AGGREGATE_ID,
          CatalogServiceMessagingSettings.EntityPublishSuccess,
          {
            content_id: payload.content_id,
          },
          txnClient,
          { envelopeOverrides: { auth_token: accessToken } },
        );
  }
}
