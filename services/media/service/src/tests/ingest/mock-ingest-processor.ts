import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

import { IngestItem, StartIngestItemCommand } from 'media-messages';
import { IngestItemTypeEnum } from 'zapatos/custom';
import { Queryable } from 'zapatos/db';
import { ingest_item_steps } from 'zapatos/schema';
import {
  IngestEntityProcessor,
  MediaInitializeResult,
  OrchestrationData,
} from '../../ingest';

export class MockIngestProcessor implements IngestEntityProcessor {
  public type: IngestItemTypeEnum = 'MOVIE';

  public async initializeMedia(
    _typedItems: IngestItem[],
    _ctx: Queryable,
  ): Promise<MediaInitializeResult> {
    return {
      existedMedia: [],
      createdMedia: [],
      displayTitleMappings: [],
    };
  }

  public getOrchestrationData(
    _content: StartIngestItemCommand,
  ): OrchestrationData[] {
    return [
      {
        aggregateId: 'unit-test-id',
        messagingSettings:
          {} satisfies Partial<MessagingSettings> as unknown as MessagingSettings,
        messagePayload: {},
        messageContext: {},
        ingestItemStep:
          {} satisfies Partial<ingest_item_steps.Insertable> as unknown as ingest_item_steps.Insertable,
      },
    ];
  }

  public async updateMetadata(): Promise<void> {}

  public async processImage(): Promise<void> {}

  public async processVideo(): Promise<void> {}
}
