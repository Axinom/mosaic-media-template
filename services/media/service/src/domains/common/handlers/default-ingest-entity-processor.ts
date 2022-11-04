import {
  EnsureImageExistsCommand,
  EnsureVideoExistsCommand,
  ImageServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import {
  difference,
  isEmptyObject,
  MosaicError,
  normalizeRelativePath,
} from '@axinom/mosaic-service-common';
import {
  IImagesIngestElement,
  ImageMessageContext,
  IMainVideoIngestElement,
  IngestItem,
  IngestMessageContext,
  ITrailersIngestElement,
  MediaServiceMessagingSettings,
  StartIngestItemCommand,
  UpdateMetadataCommand,
  VideoIngestData,
  VideoMessageContext,
} from 'media-messages';
import { v4 as uuid } from 'uuid';
import {
  IngestItemTypeEnum,
  IsoAlphaTwoCountryCodesEnum,
} from 'zapatos/custom';
import {
  conditions as c,
  deletes,
  insert,
  param,
  Queryable,
  select,
  self as value,
  SQL,
  sql,
  update,
} from 'zapatos/db';
import {
  episodes,
  ingest_item_steps,
  movies,
  movie_genres,
  tvshow_genres,
} from 'zapatos/schema';
import { CommonErrors } from '../../../common';
import {
  CreateIngestMediaResult,
  IngestEntityProcessor,
  MediaInitializeResult,
  OrchestrationData,
} from '../../../ingest';
import {
  GenreRelationInsertable,
  GenreRelationTable,
  ImagesRelationTable,
  IngestibleTable,
  IngestInsertable,
  LicenseCountriesRelationTable,
  LicenseFKSelector,
  LicenseRelationInsertable,
  LicensesRelationTable,
  NamedRelationFKSelector,
  NamedRelationTable,
  RelationFKSelector,
  TrailerRelationTable,
} from '../models';

export abstract class DefaultIngestEntityProcessor
  implements IngestEntityProcessor
{
  public abstract type: IngestItemTypeEnum;

  public abstract initializeMedia(
    typedItems: IngestItem[],
    ctx: Queryable,
  ): Promise<MediaInitializeResult>;

  public abstract getOrchestrationData(
    content: StartIngestItemCommand,
  ): OrchestrationData[];

  public abstract updateMetadata(
    content: UpdateMetadataCommand,
    ctx: Queryable,
  ): Promise<void>;

  public abstract processImage(
    entityId: number,
    imageId: string,
    imageType: ImageMessageContext['imageType'],
    dbContext: Queryable,
  ): Promise<void>;

  public abstract processVideo(
    entityId: number,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void>;

  protected async createMedia(
    insertables: IngestInsertable[],
    ingestTable: IngestibleTable,
    ctx: Queryable,
  ): Promise<CreateIngestMediaResult> {
    const result: CreateIngestMediaResult = {
      existedMedia: [],
      createdMedia: [],
    };
    const allExternalIds = insertables.map((x) => x.external_id as string);
    result.existedMedia = await select(
      ingestTable,
      { external_id: sql<SQL>`${value} ILIKE ANY(${param(allExternalIds)})` },
      { columns: ['id', 'external_id'] },
    ).run(ctx);

    const existingExternalIds = result.existedMedia.map(
      (x) => x.external_id as string,
    );
    const newExternalIds = difference(allExternalIds, existingExternalIds);

    if (newExternalIds.length > 0) {
      const newItems = insertables.filter((item) =>
        newExternalIds
          .map((x) => x.toLowerCase())
          .includes((item.external_id as string).toLowerCase()),
      );

      result.createdMedia = await insert(ingestTable, newItems, {
        returning: ['id', 'external_id'],
      }).run(ctx);
    }
    return result;
  }

  protected orchestrateMetadataUpdate(
    { item, entity_id }: StartIngestItemCommand,
    ingestItemId: number,
  ): OrchestrationData[] {
    const stepId = uuid();
    const ingestItemStep: ingest_item_steps.Insertable = {
      id: stepId,
      type: 'ENTITY',
      ingest_item_id: ingestItemId,
      sub_type: 'METADATA',
      entity_id: entity_id.toString(),
    };
    const messagePayload: UpdateMetadataCommand = { item, entity_id };
    const messageContext: IngestMessageContext = {
      ingestItemId,
      ingestItemStepId: stepId,
    };
    return [
      {
        messagingSettings: MediaServiceMessagingSettings.UpdateMetadata,
        messageContext,
        messagePayload,
        ingestItemStep,
      },
    ];
  }

  protected orchestrateMainVideo(
    element: IMainVideoIngestElement,
    ingestItemId: number,
  ): OrchestrationData[] {
    if (element?.main_video && !isEmptyObject(element.main_video)) {
      const type = 'MAIN';
      const stepId = uuid();
      const video = element.main_video as VideoIngestData;
      const ingestItemStep: ingest_item_steps.Insertable = {
        id: stepId,
        type: 'VIDEO',
        ingest_item_id: ingestItemId,
        sub_type: type,
      };
      const messagePayload: EnsureVideoExistsCommand = {
        video_location: normalizeRelativePath(video.source),
        video_profile: video.profile?.trim() || 'DEFAULT',
        tags: [type],
      };
      const messageContext: VideoMessageContext = {
        ingestItemStepId: stepId,
        ingestItemId,
        videoType: type,
      };
      return [
        {
          messagingSettings:
            VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
          messagePayload,
          messageContext,
          ingestItemStep,
        },
      ];
    }
    return [];
  }

  protected orchestrateTrailers(
    element: ITrailersIngestElement,
    ingestItemId: number,
  ): OrchestrationData[] {
    const type = 'TRAILER';
    const ingestibleTrailers =
      element?.trailers?.filter((trailer) => trailer.source) ?? [];
    const orchestrationData: OrchestrationData[] = [];
    for (const trailer of ingestibleTrailers) {
      const stepId = uuid();
      const normalizedPath = normalizeRelativePath(trailer.source);
      const ingestItemStep: ingest_item_steps.Insertable = {
        id: stepId,
        type: 'VIDEO',
        ingest_item_id: ingestItemId,
        sub_type: type,
      };
      const messagePayload: EnsureVideoExistsCommand = {
        video_location: normalizedPath,
        video_profile: trailer.profile?.trim() || 'DEFAULT',
        tags: [type],
      };
      const messageContext: VideoMessageContext = {
        ingestItemStepId: stepId,
        ingestItemId,
        videoType: type,
      };
      orchestrationData.push({
        messagingSettings:
          VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
        messagePayload,
        messageContext,
        ingestItemStep,
      });
    }
    return orchestrationData;
  }

  protected orchestrateImages(
    element: IImagesIngestElement,
    content: StartIngestItemCommand,
  ): OrchestrationData[] {
    const orchestrationData: OrchestrationData[] = [];
    if (!element?.images) {
      return orchestrationData;
    }

    for (const image of element.images) {
      const stepId = uuid();
      const normalizedPath = normalizeRelativePath(image.path);
      const ingestItemStep: ingest_item_steps.Insertable = {
        id: stepId,
        type: 'IMAGE',
        ingest_item_id: content.ingest_item_id,
        sub_type: image.type,
      };
      const messagePayload: EnsureImageExistsCommand = {
        image_location: normalizedPath,
        image_type: `${content.item.type}_${image.type}`.toLowerCase(),
      };
      const messageContext: ImageMessageContext = {
        ingestItemStepId: stepId,
        ingestItemId: content.ingest_item_id,
        imageType: image.type,
      };
      orchestrationData.push({
        messagingSettings:
          ImageServiceMultiTenantMessagingSettings.EnsureImageExists,
        messagePayload,
        messageContext,
        ingestItemStep,
      });
    }
    return orchestrationData;
  }

  protected async clearOutdatedTrailers(
    tableName: TrailerRelationTable,
    fkSelector: RelationFKSelector,
    element: ITrailersIngestElement,
    ctx: Queryable,
  ): Promise<void> {
    if (element.trailers === null || element.trailers?.length === 0) {
      await deletes(tableName, fkSelector).run(ctx);
    }
  }

  protected async clearOutdatedMainVideo(
    tableName: IngestibleTable,
    element: IMainVideoIngestElement,
    content: UpdateMetadataCommand,
    ctx: Queryable,
  ): Promise<void> {
    if (element.main_video === null || isEmptyObject(element.main_video)) {
      await update(
        tableName,
        { main_video_id: null },
        { id: content.entity_id },
      ).run(ctx);
    }
  }

  protected async clearOutdatedImages(
    tableName: ImagesRelationTable,
    fkSelector: RelationFKSelector,
    element: IImagesIngestElement,
    ctx: Queryable,
  ): Promise<void> {
    if (element.images && element.images?.length > 0) {
      const existingRelations = await select(tableName, fkSelector).run(ctx);
      const existingTypes = existingRelations.map((rel) => rel.image_type);
      const ingestTypes = element.images.map((rel) => rel.type);
      const typesToDelete = difference(existingTypes, ingestTypes);

      if (typesToDelete.length > 0) {
        await deletes(tableName, {
          ...fkSelector,
          image_type: c.isIn(typesToDelete),
        }).run(ctx);
      }
    } else if (element.images?.length === 0) {
      await deletes(tableName, fkSelector).run(ctx);
    }
  }

  protected async updateGenreRelations(
    relationTableName: GenreRelationTable,
    tableName: movie_genres.Table | tvshow_genres.Table,
    relationProperty: 'movie_genres_id' | 'tvshow_genres_id',
    relations: string[] | undefined,
    fkSelector: RelationFKSelector,
    relationsMapper: (genreIds: number[]) => GenreRelationInsertable[],
    ctx: Queryable,
  ): Promise<void> {
    if (relations && relations?.length > 0) {
      relations = relations.map((value) => value.trim());
      const existingRelations = await select(relationTableName, fkSelector).run(
        ctx,
      );

      const ingestGenres = await select(tableName, {
        title: sql<SQL>`${value} ILIKE ANY(${param(relations)})`,
      }).run(ctx);

      const nonExistentGenres = difference(
        relations,
        ingestGenres.map((relation) => relation.title),
      ).join(', ');
      if (nonExistentGenres.length > 0) {
        throw new MosaicError({
          message: `Metadata update has failed because following genres do not exist: ${nonExistentGenres}`,
          code: CommonErrors.IngestError.code,
        });
      }

      const assignedGenreIds: number[] = existingRelations.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (relation) => (relation as any)[relationProperty] as number, //TODO: see if it's possible to get rid of any here, changed with zapatos 3.6.0
      );
      const ingestGenreIds = ingestGenres.map((relation) => relation.id);
      const relationsToDelete = difference(assignedGenreIds, ingestGenreIds);
      const relationsToAdd = difference(ingestGenreIds, assignedGenreIds);

      if (relationsToDelete.length > 0) {
        const array = param(relationsToDelete);
        await deletes(relationTableName, {
          ...fkSelector,
          [relationProperty]: sql<SQL>`${value} = ANY(${array})`,
        }).run(ctx);
      }

      if (relationsToAdd.length > 0) {
        await insert(relationTableName, relationsMapper(relationsToAdd)).run(
          ctx,
        );
      }
    } else if (relations?.length === 0) {
      await deletes(relationTableName, fkSelector).run(ctx);
    }
  }

  protected async updateRelations(
    tableName: NamedRelationTable,
    relations: string[] | undefined,
    fkSelector: NamedRelationFKSelector,
    ctx: Queryable,
  ): Promise<void> {
    if (relations && relations.length > 0) {
      relations = relations.map((value) => value.trim());
      const existingRelations = await select(tableName, fkSelector, {
        columns: ['name'],
      }).run(ctx);

      const existingTagNames = existingRelations.map(
        (relation) => relation.name,
      );
      const relationsToDelete = difference(existingTagNames, relations, false);
      const relationsToAdd = difference(relations, existingTagNames, false);

      if (relationsToDelete.length > 0) {
        await deletes(tableName, {
          ...fkSelector,
          name: sql<SQL>`${value} = ANY(${param(relationsToDelete)})`,
        }).run(ctx);
      }

      if (relationsToAdd.length > 0) {
        const newRelations = relationsToAdd.map((name) => ({
          ...fkSelector,
          name,
        }));
        await insert(tableName, newRelations).run(ctx);
      }
    } else if (relations?.length === 0) {
      await deletes(tableName, fkSelector).run(ctx);
    }
  }

  protected async dropAddLicenseRelations(
    tableName: LicensesRelationTable,
    licenseCountryTableName: LicenseCountriesRelationTable,
    relations:
      | {
          insertable: LicenseRelationInsertable;
          countries: string[] | undefined;
        }[]
      | undefined,
    fkSelector: RelationFKSelector,
    licenseFkMapper: (licenseId: number) => LicenseFKSelector,
    ctx: Queryable,
  ): Promise<void> {
    if (!relations) {
      return;
    }

    await deletes(tableName, fkSelector).run(ctx);

    if (!relations?.length) {
      return;
    }

    for (const relation of relations) {
      const license = await insert(tableName, relation.insertable).run(ctx);
      if (relation.countries && relation.countries?.length > 0) {
        await insert(
          licenseCountryTableName,
          relation.countries.map((code) => ({
            ...licenseFkMapper(license.id),
            code: code as IsoAlphaTwoCountryCodesEnum,
          })),
        ).run(ctx);
      }
    }
  }

  protected async updateMainVideo(
    entityTable: movies.Table | episodes.Table,
    videoId: string,
    messageContext: VideoMessageContext,
    entityId: number,
    ctx: Queryable,
  ): Promise<void> {
    if (messageContext.videoType === 'MAIN') {
      await update(
        entityTable,
        { main_video_id: videoId },
        { id: entityId },
      ).run(ctx);
    }
  }

  protected async updateTrailers(
    trailersTable: TrailerRelationTable,
    fkSelector: RelationFKSelector,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void> {
    if (messageContext.videoType === 'TRAILER') {
      const trailerId = param(`{${videoId}}`);
      const [item] = await update(
        'ingest_items',
        { processed_trailer_ids: sql<SQL>`${value} || ${trailerId}` },
        { id: messageContext.ingestItemId },
      ).run(ctx);

      const element = item.item.data as ITrailersIngestElement;
      if (item.processed_trailer_ids.length === element?.trailers?.length) {
        await this.updateTrailerRelations(
          trailersTable,
          item.processed_trailer_ids,
          fkSelector,
          ctx,
        );
      }
    }
  }

  private async updateTrailerRelations(
    tableName: TrailerRelationTable,
    videoIds: string[],
    fkSelector: RelationFKSelector,
    ctx: Queryable,
  ): Promise<void> {
    const existingRelations = await select(tableName, fkSelector).run(ctx);

    const existingVideoIds = existingRelations.map(
      (relation) => relation.video_id,
    );
    const relationsToDelete = difference(existingVideoIds, videoIds);
    const relationsToAdd = difference(videoIds, existingVideoIds);

    if (relationsToDelete.length > 0) {
      await deletes(tableName, {
        ...fkSelector,
        video_id: c.isIn(relationsToDelete),
      }).run(ctx);
    }

    if (relationsToAdd.length > 0) {
      const newRelations = relationsToAdd.map((videoId) => ({
        ...fkSelector,
        video_id: videoId,
      }));
      await insert(tableName, newRelations).run(ctx);
    }
  }
}
