import {
  PublishServiceMessagingSettings,
  ReviewPublishedEvent,
  ReviewPublishedEventSchema,
} from 'media-messages';
import { Queryable, selectExactlyOne } from 'zapatos/db';
import { Config, DEFAULT_LOCALE_TAG } from '../../../common';
import {
  buildPublishingId,
  EntityPublishingProcessor,
  SnapshotDataAggregator,
} from '../../../publishing';
import { getReviewLocalizationsMetadata } from '../localization';

const reviewDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const review = await selectExactlyOne('reviews', { id: entityId }).run(
    queryable,
  );

  const { result: localizations, validation: localizationsValidation } =
    await getReviewLocalizationsMetadata(
      config,
      authToken,
      review.id.toString(),
    );

  const snapshotJson: ReviewPublishedEvent = {
    content_id: buildPublishingId('reviews', review.id),
    rating: review.rating ?? 0,
    localizations: localizations ?? [
      {
        is_default_locale: true,
        language_tag: DEFAULT_LOCALE_TAG,
        title: review.title,
        description: review.description ?? undefined,
      },
    ],
  };

  return {
    result: snapshotJson,
    validation: [...localizationsValidation],
  };
};

export const publishingReviewProcessor: EntityPublishingProcessor = {
  type: 'reviews',
  aggregator: reviewDataAggregator,
  validationSchema: ReviewPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.ReviewPublished,
  unpublishMessagingSettings: PublishServiceMessagingSettings.ReviewUnpublished,
};
