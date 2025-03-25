import { nullable, optional } from '@axinom/mosaic-db-common';
import {
  ImageMessageContext,
  IngestItem,
  ReviewIngestData,
  StartIngestItemCommand,
  UpdateMetadataCommand,
  VideoMessageContext,
} from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import { Queryable, update } from 'zapatos/db';
import { MediaInitializeResult, OrchestrationData } from '../../../ingest';
import { buildDisplayTitle, DefaultIngestEntityProcessor } from '../../common';

export class IngestReviewProcessor extends DefaultIngestEntityProcessor {
  public type: IngestItemTypeEnum = 'REVIEW';

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
        'REVIEW',
        item.data as { title: string },
      ),
    }));

    const insertables = displayTitleMappings.map(
      ({ display_title: _, ...insertable }) => insertable,
    );

    const { createdMedia, existedMedia } = await this.createMedia(
      insertables,
      'reviews',
      ctx,
    );

    return { createdMedia, existedMedia, displayTitleMappings };
  }

  public getOrchestrationData(
    content: StartIngestItemCommand,
  ): OrchestrationData[] {
    const review = content.item.data as ReviewIngestData;
    const orchestrationData: OrchestrationData[] = [
      ...this.orchestrateMetadataUpdate(content, content.ingest_item_id),
      ...this.orchestrateLocalizations(review, content),
    ];

    return orchestrationData;
  }

  public async updateMetadata(
    content: UpdateMetadataCommand,
    ctx: Queryable,
    ingestItemId?: number,
  ): Promise<void> {
    const review = content.item.data as ReviewIngestData;

    await update(
      'reviews',
      {
        ...optional(ingestItemId, (val) => ({ ingest_correlation_id: val })),
        title: review.title?.trim(),
        ...nullable(review.description, (val) => ({
          description: val?.trim(),
        })),
        rating: review.rating,
      },
      { id: content.entity_id },
    ).run(ctx);

    await this.clearIngestCorrelationId(
      'reviews',
      ingestItemId,
      content.entity_id,
      ctx,
    );
  }

  public async processImage(
    _entityId: number,
    _imageId: string,
    _imageType: ImageMessageContext['imageType'],
    _dbContext: Queryable,
  ): Promise<void> {
    console.log('Images are not supported by reviews');
  }

  public async processVideo(
    _entityId: number,
    _videoId: string,
    _messageContext: VideoMessageContext,
    _ctx: Queryable,
  ): Promise<void> {
    console.log('Videos are not supported by reviews');
  }
}
