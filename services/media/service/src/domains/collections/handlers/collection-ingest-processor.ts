import { nullable, optional } from '@axinom/mosaic-db-common';
import {
  CollectionEntityElement,
  CollectionIngestData,
  IngestItem,
  StartIngestItemCommand,
  UpdateMetadataCommand,
  VideoMessageContext,
} from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import {
  deletes,
  insert,
  Queryable,
  selectOne,
  update,
  upsert,
} from 'zapatos/db';
import { collection_countries, collection_relations } from 'zapatos/schema';
import { MediaInitializeResult, OrchestrationData } from '../../../ingest';
import { buildDisplayTitle, DefaultIngestEntityProcessor } from '../../common';
import { assertCircularCollectionRelation } from '../common';

export class IngestCollectionProcessor extends DefaultIngestEntityProcessor {
  public type: IngestItemTypeEnum = 'COLLECTION';

  public async initializeMedia(
    items: IngestItem[],
    ctx: Queryable,
  ): Promise<MediaInitializeResult> {
    if (items.length === 0) {
      return { createdMedia: [], existedMedia: [], displayTitleMappings: [] };
    }

    const displayTitleMappings = items.map((item) => ({
      title: item.data.title as string,
      external_id: item.external_id,
      display_title: buildDisplayTitle(
        'COLLECTION',
        item.data as { title: string },
      ),
    }));

    const insertables = displayTitleMappings.map(
      ({ display_title: _, ...insertable }) => insertable,
    );

    const { createdMedia, existedMedia } = await this.createMedia(
      insertables,
      'collections',
      ctx,
    );

    return { createdMedia, existedMedia, displayTitleMappings };
  }

  public getOrchestrationData(
    content: StartIngestItemCommand,
  ): OrchestrationData[] {
    const collection = content.item.data as CollectionIngestData;
    const orchestrationData: OrchestrationData[] = [
      ...this.orchestrateMetadataUpdate(content, content.ingest_item_id),
      ...this.orchestrateImages(collection, content),
      ...this.orchestrateLocalizations(collection, content),
      ...this.orchestrateImageLocalizations(collection, content),
    ];

    return orchestrationData;
  }

  public async updateMetadata(
    content: UpdateMetadataCommand,
    ctx: Queryable,
    ingestItemId?: number,
  ): Promise<void> {
    const collection = content.item.data as CollectionIngestData;

    await update(
      'collections',
      {
        ...optional(ingestItemId, (val) => ({ ingest_correlation_id: val })),
        external_id: content.item.external_id,
        title: collection.title?.trim(),
        ...nullable(collection.synopsis, (val) => ({ synopsis: val?.trim() })),
        ...nullable(collection.description, (val) => ({
          description: val?.trim(),
        })),
        ...nullable(collection.custom, (val) => ({ extended_field: val })),
      },
      { id: content.entity_id },
    ).run(ctx);

    await this.clearIngestCorrelationId(
      'movies',
      ingestItemId,
      content.entity_id,
      ctx,
    );

    await this.updateRelations(
      'collections_tags',
      collection.tags,
      { collection_id: content.entity_id },
      ctx,
    );

    if (collection.production_countries) {
      await this.updateCollectionCountries(
        content.entity_id,
        collection.production_countries,
        ctx,
      );
    }

    await this.updateCollectionEntities(
      content.entity_id,
      collection.entities!,
      ctx,
    );

    await this.clearOutdatedImages(
      'collections_images',
      { collection_id: content.entity_id },
      collection,
      ctx,
    );
  }

  public async processImage(
    entityId: number,
    imageId: string,
    imageType:
      | 'COLLECTION_COVER_1x1'
      | 'COLLECTION_COVER_4x1'
      | 'COLLECTION_CLEAN_COVER_1x1'
      | 'COLLECTION_CLEAN_COVER_4x1'
      | 'COLLECTION_LIST_15x16'
      | 'COLLECTION_LIST_1x1',
    dbContext: Queryable,
  ): Promise<void> {
    await upsert(
      'collections_images',
      {
        collection_id: entityId,
        image_id: imageId,
        image_type: imageType,
      },
      ['collection_id', 'image_type'],
    ).run(dbContext);
  }

  public async processVideo(
    entityId: number,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async updateCollectionCountries(
    collectionId: number,
    countries: string[],
    ctx: Queryable,
  ): Promise<void> {
    const collectionCountriesInsertable: collection_countries.Insertable[] = [];
    await deletes('collection_countries', { collection_id: collectionId }).run(
      ctx,
    );
    for (const country of countries) {
      const countryGroup = await selectOne('country_groups', {
        name: country,
      }).run(ctx);
      if (countryGroup !== undefined) {
        collectionCountriesInsertable.push({
          collection_id: collectionId,
          country_group_id: countryGroup.id,
        });
      } else {
        collectionCountriesInsertable.push({
          collection_id: collectionId,
          country_id: country,
        });
      }
    }
    await insert('collection_countries', collectionCountriesInsertable).run(
      ctx,
    );
  }

  private async updateCollectionEntities(
    collectionId: number,
    entities: CollectionEntityElement[],
    ctx: Queryable,
  ): Promise<void> {
    await deletes('collection_relations', { collection_id: collectionId }).run(
      ctx,
    );
    const collectionRelationsInsertable: collection_relations.Insertable[] = [];
    for (const entity of entities) {
      switch (entity.type) {
        case 'MOVIE':
          const movie = await selectOne('movies', {
            external_id: entity.external_id,
          }).run(ctx);
          if (movie !== undefined) {
            collectionRelationsInsertable.push({
              sort_order: entity.sort_order,
              collection_id: collectionId,
              movie_id: movie.id,
            });
          }
          break;
        case 'TVSHOW':
          const tvshow = await selectOne('tvshows', {
            external_id: entity.external_id,
          }).run(ctx);
          if (tvshow !== undefined) {
            collectionRelationsInsertable.push({
              sort_order: entity.sort_order,
              collection_id: collectionId,
              tvshow_id: tvshow.id,
            });
          }
          break;
        case 'COLLECTION':
          const collection = await selectOne('collections', {
            external_id: entity.external_id,
          }).run(ctx);
          if (collection !== undefined) {
            await assertCircularCollectionRelation(
              ctx,
              String(collectionId),
              String(collection.id),
            );
            collectionRelationsInsertable.push({
              sort_order: entity.sort_order,
              collection_id: collectionId,
              child_collection_id: collection.id,
            });
          }
          break;
      }
    }
    await insert('collection_relations', collectionRelationsInsertable).run(
      ctx,
    );
  }
}
