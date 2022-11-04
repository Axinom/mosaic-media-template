import { PublishServiceMessagingSettings } from 'media-messages';
import { Table } from 'zapatos/schema';
import { CustomSchemaValidator, SnapshotDataAggregator } from '../utils';

/**
 * Necessary configuration bits and helper functions to publish/unpublish a content entity.
 */
export interface EntityPublishingProcessor {
  type: Table;
  aggregator: SnapshotDataAggregator;
  validator?: CustomSchemaValidator;
  validationSchema?: Record<string, unknown>;
  publishMessagingSettings: PublishServiceMessagingSettings;
  unpublishMessagingSettings: PublishServiceMessagingSettings;
}
