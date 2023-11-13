import {
  MessagingSettings,
  MultiTenantMessagingSettings,
} from '@axinom/mosaic-message-bus-abstractions';
import {
  ImageMessageContext,
  IngestItem,
  StartIngestItemCommand,
  UpdateMetadataCommand,
  VideoMessageContext,
} from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import { Queryable } from 'zapatos/db';
import { ingest_item_steps } from 'zapatos/schema';

export interface IngestMediaItem {
  id: number;
  external_id: string | null;
}

export interface DisplayTitleMapping {
  display_title: string;
  external_id: string;
}

export interface IngestItemInsertable {
  id: number;
  external_id: string | null;
  display_title: string;
}

export interface CreateIngestMediaResult {
  existedMedia: IngestMediaItem[];
  createdMedia: IngestMediaItem[];
}

export interface MediaInitializeResult extends CreateIngestMediaResult {
  displayTitleMappings: DisplayTitleMapping[];
}

export interface OrchestrationData {
  aggregateId: string;
  messagingSettings: MultiTenantMessagingSettings | MessagingSettings;
  messagePayload: unknown;
  messageContext: unknown;
  ingestItemStep: ingest_item_steps.Insertable;
}

export interface IngestEntityProcessor {
  type: IngestItemTypeEnum;

  initializeMedia(
    typedItems: IngestItem[],
    ctx: Queryable,
  ): Promise<MediaInitializeResult>;

  getOrchestrationData(content: StartIngestItemCommand): OrchestrationData[];

  updateMetadata(content: UpdateMetadataCommand, ctx: Queryable): Promise<void>;

  processImage(
    entityId: number,
    imageId: string,
    imageType: ImageMessageContext['imageType'],
    dbContext: Queryable,
  ): Promise<void>;

  processVideo(
    entityId: number,
    videoId: string,
    messageContext: VideoMessageContext,
    ctx: Queryable,
  ): Promise<void>;
}
