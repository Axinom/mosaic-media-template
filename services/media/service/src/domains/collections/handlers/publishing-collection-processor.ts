import {
  CollectionPublishedEvent,
  CollectionPublishedEventSchema,
  PublishServiceMessagingSettings,
} from 'media-messages';
import * as Yup from 'yup';
import { parent, Queryable, select, selectExactlyOne } from 'zapatos/db';
import { Config } from '../../../common';
import {
  buildPublishingId,
  EntityPublishingProcessor,
  getReadablePath,
  requiredCover,
  SnapshotDataAggregator,
  SnapshotValidationResult,
  validateYupPublishSchema,
} from '../../../publishing';
import { getImagesMetadata } from '../../common';

const collectionDataAggregator: SnapshotDataAggregator = async (
  entityId: number,
  authToken: string,
  config: Config,
  queryable: Queryable,
) => {
  const collection = await selectExactlyOne(
    'collections',
    { id: entityId },
    {
      lateral: {
        images: select('collections_images', {
          collection_id: parent('id'),
        }),
        tags: select('collections_tags', { collection_id: parent('id') }),
        relations: select('collection_relations', {
          collection_id: parent('id'),
        }),
      },
    },
  ).run(queryable);

  const { result: images, validation: imagesValidation } =
    await getImagesMetadata(
      config.imageServiceBaseUrl,
      authToken,
      collection.images,
    );

  const snapshotJson: CollectionPublishedEvent = {
    content_id: buildPublishingId('collections', collection.id),
    title: collection.title,
    synopsis: collection.synopsis ?? undefined,
    description: collection.description ?? undefined,
    tags: collection.tags.map((c) => c.name),
    images: images,
    related_items: collection.relations.map((r) => ({
      order_no: r.sort_order,
      movie_id: r.movie_id
        ? buildPublishingId('movies', r.movie_id)
        : undefined,
      tvshow_id: r.tvshow_id
        ? buildPublishingId('tvshows', r.tvshow_id)
        : undefined,
      season_id: r.season_id
        ? buildPublishingId('seasons', r.season_id)
        : undefined,
      episode_id: r.episode_id
        ? buildPublishingId('episodes', r.episode_id)
        : undefined,
      relation_type: r.movie_id
        ? 'MOVIE'
        : r.tvshow_id
        ? 'TVSHOW'
        : r.season_id
        ? 'SEASON'
        : 'EPISODE',
    })),
  };

  return {
    result: snapshotJson,
    validation: imagesValidation,
  };
};

const customCollectionValidation = async (
  json: unknown,
): Promise<SnapshotValidationResult[]> => {
  const yupSchema = Yup.object({
    images: requiredCover,
    related_items: Yup.array(
      Yup.object().test({
        name: 'one_relation_id',
        message: (params) => {
          const identifier = getReadablePath(params.path);
          return `${identifier} must have a relation id defined.`;
        },
        test: (value) =>
          !!value.movie_id ||
          !!value.tvshow_id ||
          !!value.season_id ||
          !!value.episode_id,
      }),
    ).min(1, `At least one related item must be assigned.`),
  });
  return validateYupPublishSchema(json, yupSchema);
};

export const publishingCollectionProcessor: EntityPublishingProcessor = {
  type: 'collections',
  aggregator: collectionDataAggregator,
  validator: customCollectionValidation,
  validationSchema: CollectionPublishedEventSchema,
  publishMessagingSettings: PublishServiceMessagingSettings.CollectionPublished,
  unpublishMessagingSettings:
    PublishServiceMessagingSettings.CollectionUnpublished,
};
