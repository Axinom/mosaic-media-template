import { nullable } from '@axinom/mosaic-db-common';
import {
  ImageMessageContext,
  IngestItem,
  MovieIngestData,
  StartIngestItemCommand,
  UpdateMetadataCommand,
  VideoMessageContext,
} from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import { Queryable, update, upsert } from 'zapatos/db';
import { MediaInitializeResult, OrchestrationData } from '../../../ingest';
import { buildDisplayTitle, DefaultIngestEntityProcessor } from '../../common';

export class IngestMovieProcessor extends DefaultIngestEntityProcessor {
  public type: IngestItemTypeEnum = 'MOVIE';

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
      display_title: buildDisplayTitle('MOVIE', item.data as { title: string }),
    }));

    const insertables = displayTitleMappings.map(
      ({ display_title: _, ...insertable }) => insertable,
    );

    const { createdMedia, existedMedia } = await this.createMedia(
      insertables,
      'movies',
      ctx,
    );

    return { createdMedia, existedMedia, displayTitleMappings };
  }

  public getOrchestrationData(
    content: StartIngestItemCommand,
  ): OrchestrationData[] {
    const movie = content.item.data as MovieIngestData;
    const orchestrationData: OrchestrationData[] = [
      ...this.orchestrateMetadataUpdate(content, content.ingest_item_id),
      ...this.orchestrateMainVideo(movie, content.ingest_item_id),
      ...this.orchestrateTrailers(movie, content.ingest_item_id),
      ...this.orchestrateImages(movie, content),
    ];

    return orchestrationData;
  }

  public async updateMetadata(
    content: UpdateMetadataCommand,
    ctx: Queryable,
  ): Promise<void> {
    const movie = content.item.data as MovieIngestData;

    await update(
      'movies',
      {
        external_id: content.item.external_id,
        title: movie.title?.trim(),
        ...nullable(movie.original_title, (val) => ({
          original_title: val?.trim(),
        })),
        ...nullable(movie.synopsis, (val) => ({ synopsis: val?.trim() })),
        ...nullable(movie.description, (val) => ({ description: val?.trim() })),
        ...nullable(movie.studio, (val) => ({ studio: val?.trim() })),
        ...nullable(movie.released, (val) => ({ released: val })),
      },
      { id: content.entity_id },
    ).run(ctx);

    await this.updateRelations(
      'movies_tags',
      movie.tags,
      { movie_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'movies_casts',
      movie.cast,
      { movie_id: content.entity_id },
      ctx,
    );

    await this.updateRelations(
      'movies_production_countries',
      movie.production_countries,
      { movie_id: content.entity_id },
      ctx,
    );

    await this.dropAddLicenseRelations(
      'movies_licenses',
      'movies_licenses_countries',
      movie.licenses?.map((r) => ({
        insertable: {
          movie_id: content.entity_id,
          license_start: r.start,
          license_end: r.end,
        },
        countries: r.countries,
      })),
      { movie_id: content.entity_id },
      (licenseId) => ({
        movies_license_id: licenseId,
      }),
      ctx,
    );

    await this.updateGenreRelations(
      'movies_movie_genres',
      'movie_genres',
      'movie_genres_id',
      movie.genres,
      { movie_id: content.entity_id },
      (ids) =>
        ids.map((id) => ({ movie_id: content.entity_id, movie_genres_id: id })),
      ctx,
    );

    await this.clearOutdatedTrailers(
      'movies_trailers',
      { movie_id: content.entity_id },
      movie,
      ctx,
    );

    await this.clearOutdatedMainVideo('movies', movie, content, ctx);

    await this.clearOutdatedImages(
      'movies_images',
      { movie_id: content.entity_id },
      movie,
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
      'movies_images',
      {
        movie_id: entityId,
        image_id: imageId,
        image_type: imageType,
      },
      ['movie_id', 'image_type'],
    ).run(dbContext);
  }

  public async processVideo(
    entityId: number,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void> {
    await this.updateMainVideo(
      'movies',
      videoId,
      messageContext,
      entityId,
      ctx,
    );
    await this.updateTrailers(
      'movies_trailers',
      { movie_id: entityId },
      videoId,
      messageContext,
      ctx,
    );
  }
}
