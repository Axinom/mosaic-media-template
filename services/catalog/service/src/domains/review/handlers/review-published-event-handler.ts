import { Logger } from '@axinom/mosaic-service-common';
import {
  TransactionalInboxMessageHandler,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import {
  PublishServiceMessagingSettings,
  ReviewPublishedEvent,
} from 'media-messages';
import { ClientBase } from 'pg';
import { deletes, insert } from 'zapatos/db';
import { review_localizations } from 'zapatos/schema';
import { Config, syncInMemoryLocales } from '../../../common';

export class ReviewPublishedEventHandler extends TransactionalInboxMessageHandler<
  ReviewPublishedEvent,
  Config
> {
  constructor(config: Config) {
    super(
      PublishServiceMessagingSettings.ReviewPublished,
      new Logger({
        config,
        context: ReviewPublishedEventHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload }: TypedTransactionalMessage<ReviewPublishedEvent>,
    txnClient: ClientBase,
  ): Promise<void> {
    await deletes('review', { id: payload.content_id }).run(txnClient);

    await insert('review', {
      id: payload.content_id,
      rating: payload.rating,
    }).run(txnClient);

    if (payload.localizations) {
      await syncInMemoryLocales(payload.localizations, txnClient);
      await insert(
        'review_localizations',
        payload.localizations.map(
          (l): review_localizations.Insertable => ({
            review_id: payload.content_id,
            is_default_locale: l.is_default_locale,
            locale: l.language_tag,
            title: l.title,
            description: l.description,
          }),
        ),
      ).run(txnClient);
    }
  }
}
