import { nullable, optional } from '@axinom/mosaic-db-common';
import {
  ImageMessageContext,
  IngestItem,
  SeasonIngestData,
  StartIngestItemCommand,
  UpdateMetadataCommand,
  VideoMessageContext,
} from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import { conditions as c, Queryable, select, update, upsert } from 'zapatos/db';
import { MediaInitializeResult, OrchestrationData } from '../../../ingest';
import { buildDisplayTitle, DefaultIngestEntityProcessor } from '../../common';

export class IngestSeasonProcessor extends DefaultIngestEntityProcessor {
  public type: IngestItemTypeEnum = 'SEASON';

  public async initializeMedia(
    items: IngestItem[],
    ctx: Queryable,
  ): Promise<MediaInitializeResult> {
    if (items.length === 0) {
      return { createdMedia: [], existedMedia: [], displayTitleMappings: [] };
    }

    const tvShows = await select(
      'tvshows',
      { external_id: c.isNotNull },
      { columns: ['id', 'external_id', 'title'] },
    ).run(ctx);

    const displayTitleMappings = items.map((item) => {
      const parentTvShow = tvShows.find(
        (tvShow) =>
          (tvShow.external_id as string).toLowerCase() ===
          (item.data.parent_external_id as string).toLowerCase(),
      );
      return {
        index: item.data.index as number,
        tvshow_id: parentTvShow?.id,
        external_id: item.external_id,
        display_title: buildDisplayTitle(
          'SEASON',
          item.data as { index: number },
          parentTvShow,
        ),
      };
    });

    const insertables = displayTitleMappings.map(
      ({ display_title: _, ...insertable }) => insertable,
    );

    const { createdMedia, existedMedia } = await this.createMedia(
      insertables,
      'seasons',
      ctx,
    );

    return { createdMedia, existedMedia, displayTitleMappings };
  }

  public getOrchestrationData(
    content: StartIngestItemCommand,
  ): OrchestrationData[] {
    const season = content.item.data as SeasonIngestData;
    const orchestrationData: OrchestrationData[] = [
      ...this.orchestrateMetadataUpdate(content, content.ingest_item_id),
      ...this.orchestrateTrailers(season, content.ingest_item_id),
      ...this.orchestrateImages(season, content),
      ...this.orchestrateLocalizations(season, content),
    ];

    return orchestrationData;
  }

  public async updateMetadata(
    content: UpdateMetadataCommand,
    ctx: Queryable,
    ingestItemId?: number,
  ): Promise<void> {
    const season = content.item.data as SeasonIngestData;
    await update(
      'seasons',
      {
        ...optional(ingestItemId, (val) => ({ ingest_correlation_id: val })),
        external_id: content.item.external_id,
        index: season.index,
        ...nullable(season.synopsis, (val) => ({ synopsis: val?.trim() })),
        ...nullable(season.description, (val) => ({
          description: val?.trim(),
        })),
        ...nullable(season.studio, (val) => ({ studio: val?.trim() })),
        ...nullable(season.released, (val) => ({ released: val })),
      },
      { id: content.entity_id },
    ).run(ctx);

    await this.clearIngestCorrelationId(
      'seasons',
      ingestItemId,
      content.entity_id,
      ctx,
    );

    await this.updateRelations(
      'seasons_tags',
      season.tags,
      { season_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'seasons_casts',
      season.cast,
      { season_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'seasons_production_countries',
      season.production_countries,
      { season_id: content.entity_id },
      ctx,
    );

    await this.dropAddLicenseRelations(
      'seasons_licenses',
      'seasons_licenses_countries',
      season.licenses?.map((r) => ({
        insertable: {
          season_id: content.entity_id,
          license_start: r.start,
          license_end: r.end,
        },
        countries: r.countries,
      })),
      { season_id: content.entity_id },
      (licenseId) => ({
        seasons_license_id: licenseId,
      }),
      ctx,
    );

    await this.updateGenreRelations(
      'seasons_tvshow_genres',
      'tvshow_genres',
      'tvshow_genres_id',
      season.genres,
      { season_id: content.entity_id },
      (ids) =>
        ids.map((id) => ({
          season_id: content.entity_id,
          tvshow_genres_id: id,
        })),
      ctx,
    );

    await this.clearOutdatedTrailers(
      'seasons_trailers',
      { season_id: content.entity_id },
      season,
      ctx,
    );

    await this.clearOutdatedImages(
      'seasons_images',
      { season_id: content.entity_id },
      season,
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
      'seasons_images',
      {
        image_id: imageId,
        image_type: imageType,
        season_id: entityId,
      },
      ['season_id', 'image_type'],
    ).run(dbContext);
  }

  public async processVideo(
    entityId: number,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void> {
    await this.updateTrailers(
      'seasons_trailers',
      { season_id: entityId },
      videoId,
      messageContext,
      ctx,
    );
  }
}
