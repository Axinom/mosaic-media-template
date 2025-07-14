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
  TvshowUnpublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { Config } from '../../../common';
import { requestServiceAccountToken } from '../../../common/utils/token-utils';

export class TvshowUnpublishedEventHandler extends TransactionalInboxMessageHandler<
  TvshowUnpublishedEvent,
  Config
> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    config: Config
  ) {
    super(
      PublishServiceMessagingSettings.TvshowUnpublished,
      new Logger({
        config,
        context: TvshowUnpublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<TvshowUnpublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await db.deletes('tvshow', { id: payload.content_id }).run(txnClient);

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
