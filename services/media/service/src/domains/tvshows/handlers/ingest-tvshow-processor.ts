import { nullable } from '@axinom/mosaic-db-common';
import {
  ImageMessageContext,
  IngestItem,
  StartIngestItemCommand,
  TvShowIngestData,
  UpdateMetadataCommand,
  VideoMessageContext,
} from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import { Queryable, update, upsert } from 'zapatos/db';
import { MediaInitializeResult, OrchestrationData } from '../../../ingest';
import { buildDisplayTitle, DefaultIngestEntityProcessor } from '../../common';

export class IngestTvshowProcessor extends DefaultIngestEntityProcessor {
  public type: IngestItemTypeEnum = 'TVSHOW';

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
        'TVSHOW',
        item.data as { title: string },
      ),
    }));

    const insertables = displayTitleMappings.map(
      ({ display_title: _, ...insertable }) => insertable,
    );

    const { createdMedia, existedMedia } = await this.createMedia(
      insertables,
      'tvshows',
      ctx,
    );

    return { createdMedia, existedMedia, displayTitleMappings };
  }

  public getOrchestrationData(
    content: StartIngestItemCommand,
  ): OrchestrationData[] {
    const tvshow = content.item.data as TvShowIngestData;
    const orchestrationData: OrchestrationData[] = [
      ...this.orchestrateMetadataUpdate(content, content.ingest_item_id),
      ...this.orchestrateTrailers(tvshow, content.ingest_item_id),
      ...this.orchestrateImages(tvshow, content),
    ];

    return orchestrationData;
  }

  public async updateMetadata(
    content: UpdateMetadataCommand,
    ctx: Queryable,
  ): Promise<void> {
    const tvshow = content.item.data as TvShowIngestData;

    await update(
      'tvshows',
      {
        external_id: content.item.external_id,
        title: tvshow.title?.trim(),
        ...nullable(tvshow.original_title, (val) => ({
          original_title: val?.trim(),
        })),
        ...nullable(tvshow.synopsis, (val) => ({ synopsis: val?.trim() })),
        ...nullable(tvshow.description, (val) => ({
          description: val?.trim(),
        })),
        ...nullable(tvshow.studio, (val) => ({ studio: val?.trim() })),
        ...nullable(tvshow.released, (val) => ({ released: val })),
      },
      { id: content.entity_id },
    ).run(ctx);

    await this.updateRelations(
      'tvshows_tags',
      tvshow.tags,
      { tvshow_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'tvshows_casts',
      tvshow.cast,
      { tvshow_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'tvshows_production_countries',
      tvshow.production_countries,
      { tvshow_id: content.entity_id },
      ctx,
    );

    await this.dropAddLicenseRelations(
      'tvshows_licenses',
      'tvshows_licenses_countries',
      tvshow.licenses?.map((r) => ({
        insertable: {
          tvshow_id: content.entity_id,
          license_start: r.start,
          license_end: r.end,
        },
        countries: r.countries,
      })),
      { tvshow_id: content.entity_id },
      (licenseId) => ({
        tvshows_license_id: licenseId,
      }),
      ctx,
    );

    await this.updateGenreRelations(
      'tvshows_tvshow_genres',
      'tvshow_genres',
      'tvshow_genres_id',
      tvshow.genres,
      { tvshow_id: content.entity_id },
      (ids) =>
        ids.map((id) => ({
          tvshow_id: content.entity_id,
          tvshow_genres_id: id,
        })),
      ctx,
    );

    await this.clearOutdatedTrailers(
      'tvshows_trailers',
      { tvshow_id: content.entity_id },
      tvshow,
      ctx,
    );

    await this.clearOutdatedImages(
      'tvshows_images',
      { tvshow_id: content.entity_id },
      tvshow,
      ctx,
    );
  }

  public async processImage(
    entityId: number,
    imageId: string,
    imageType: ImageMessageContext['imageType'],
    dbContext: Queryable,
  ): Promise<void> {
    await upsert(
      'tvshows_images',
      {
        tvshow_id: entityId,
        image_id: imageId,
        image_type: imageType,
      },
      ['tvshow_id', 'image_type'],
    ).run(dbContext);
  }

  public async processVideo(
    entityId: number,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void> {
    await this.updateTrailers(
      'tvshows_trailers',
      { tvshow_id: entityId },
      videoId,
      messageContext,
      ctx,
    );
  }
}
