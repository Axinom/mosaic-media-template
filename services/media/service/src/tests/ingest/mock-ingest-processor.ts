import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import { stub } from 'jest-auto-stub';
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
        messagingSettings: stub<MessagingSettings>(),
        messagePayload: {},
        messageContext: {},
        ingestItemStep: stub<ingest_item_steps.Insertable>(),
      },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async updateMetadata(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async processImage(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async processVideo(): Promise<void> {}
}
