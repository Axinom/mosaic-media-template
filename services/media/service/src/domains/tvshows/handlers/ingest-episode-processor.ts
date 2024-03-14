import { nullable, optional } from '@axinom/mosaic-db-common';
import {
  EpisodeIngestData,
  ImageMessageContext,
  IngestItem,
  StartIngestItemCommand,
  UpdateMetadataCommand,
  VideoMessageContext,
} from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import {
  conditions as c,
  parent,
  Queryable,
  select,
  selectOne,
  update,
  upsert,
} from 'zapatos/db';
import { MediaInitializeResult, OrchestrationData } from '../../../ingest';
import { buildDisplayTitle, DefaultIngestEntityProcessor } from '../../common';

export class IngestEpisodeProcessor extends DefaultIngestEntityProcessor {
  public type: IngestItemTypeEnum = 'EPISODE';

  public async initializeMedia(
    items: IngestItem[],
    ctx: Queryable,
  ): Promise<MediaInitializeResult> {
    if (items.length === 0) {
      return { createdMedia: [], existedMedia: [], displayTitleMappings: [] };
    }

    const seasons = await select(
      'seasons',
      { external_id: c.isNotNull },
      {
        columns: ['id', 'external_id', 'index'],
        lateral: {
          tvshow: selectOne(
            'tvshows',
            { id: parent('tvshow_id') },
            { columns: ['title'] },
          ),
        },
      },
    ).run(ctx);

    const displayTitleMappings = items.map((item) => {
      const parentSeason = seasons.find(
        (season) =>
          (season.external_id as string).toLowerCase() ===
          (item.data.parent_external_id as string).toLowerCase(),
      );
      return {
        title: item.data.title as string,
        index: item.data.index as number,
        season_id: parentSeason?.id,
        external_id: item.external_id,
        display_title: buildDisplayTitle(
          'EPISODE',
          item.data as { title: string; index: number },
          parentSeason,
          parentSeason?.tvshow,
        ),
      };
    });

    const insertables = displayTitleMappings.map(
      ({ display_title: _, ...insertable }) => insertable,
    );

    const { createdMedia, existedMedia } = await this.createMedia(
      insertables,
      'episodes',
      ctx,
    );

    return { createdMedia, existedMedia, displayTitleMappings };
  }

  public getOrchestrationData(
    content: StartIngestItemCommand,
  ): OrchestrationData[] {
    const episode = content.item.data as EpisodeIngestData;
    const orchestrationData: OrchestrationData[] = [
      ...this.orchestrateMetadataUpdate(content, content.ingest_item_id),
      ...this.orchestrateMainVideo(episode, content.ingest_item_id),
      ...this.orchestrateTrailers(episode, content.ingest_item_id),
      ...this.orchestrateImages(episode, content),
      ...this.orchestrateLocalizations(episode, content),
    ];

    return orchestrationData;
  }

  public async updateMetadata(
    content: UpdateMetadataCommand,
    ctx: Queryable,
    ingestItemId?: number,
  ): Promise<void> {
    const episode = content.item.data as EpisodeIngestData;

    await update(
      'episodes',
      {
        ...optional(ingestItemId, (val) => ({ ingest_correlation_id: val })),
        external_id: content.item.external_id,
        title: episode.title?.trim(),
        index: episode.index,
        ...nullable(episode.original_title, (val) => ({
          original_title: val?.trim(),
        })),
        ...nullable(episode.synopsis, (val) => ({ synopsis: val?.trim() })),
        ...nullable(episode.description, (val) => ({
          description: val?.trim(),
        })),
        ...nullable(episode.studio, (val) => ({ studio: val?.trim() })),
        ...nullable(episode.released, (val) => ({ released: val })),
      },
      { id: content.entity_id },
    ).run(ctx);

    await this.clearIngestCorrelationId(
      'episodes',
      ingestItemId,
      content.entity_id,
      ctx,
    );

    await this.updateRelations(
      'episodes_tags',
      episode.tags,
      { episode_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'episodes_casts',
      episode.cast,
      { episode_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'episodes_production_countries',
      episode.production_countries,
      { episode_id: content.entity_id },
      ctx,
    );

    await this.dropAddLicenseRelations(
      'episodes_licenses',
      'episodes_licenses_countries',
      episode.licenses?.map((r) => ({
        insertable: {
          episode_id: content.entity_id,
          license_start: r.start,
          license_end: r.end,
        },
        countries: r.countries,
      })),
      { episode_id: content.entity_id },
      (licenseId) => ({
        episodes_license_id: licenseId,
      }),
      ctx,
    );

    await this.updateGenreRelations(
      'episodes_tvshow_genres',
      'tvshow_genres',
      'tvshow_genres_id',
      episode.genres,
      { episode_id: content.entity_id },
      (ids) =>
        ids.map((id) => ({
          episode_id: content.entity_id,
          tvshow_genres_id: id,
        })),
      ctx,
    );

    await this.clearOutdatedTrailers(
      'episodes_trailers',
      { episode_id: content.entity_id },
      episode,
      ctx,
    );

    await this.clearOutdatedMainVideo('episodes', episode, content, ctx);

    await this.clearOutdatedImages(
      'episodes_images',
      { episode_id: content.entity_id },
      episode,
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
      'episodes_images',
      {
        image_id: imageId,
        image_type: imageType,
        episode_id: entityId,
      },
      ['episode_id', 'image_type'],
    ).run(dbContext);
  }

  public async processVideo(
    entityId: number,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void> {
    await this.updateMainVideo(
      'episodes',
      videoId,
      messageContext,
      entityId,
      ctx,
    );
    await this.updateTrailers(
      'episodes_trailers',
      { episode_id: entityId },
      videoId,
      messageContext,
      ctx,
    );
  }
}
