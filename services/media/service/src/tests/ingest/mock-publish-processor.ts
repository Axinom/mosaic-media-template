import { PublishServiceMessagingSettings } from 'media-messages';
import { EntityPublishingProcessor } from '../../publishing';

export const testAllowAllSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'allow_all_published_event',
  description: 'This is a mock schema that allows any json.',
  properties: {},
  additionalProperties: true,
};

export const mockPublishingProcessor: EntityPublishingProcessor = {
  type: 'movies',
  aggregator: async () => ({
    result: { content_id: 'test' },
    validation: [],
  }),
  validator: async () => [
    { context: 'METADATA', severity: 'WARNING', message: 'mock message' },
  ],
  validationSchema: testAllowAllSchema,
  publishMessagingSettings: {
    messageType: 'mock-publish',
  } satisfies Partial<PublishServiceMessagingSettings> as unknown as PublishServiceMessagingSettings,
  unpublishMessagingSettings: {
    messageType: 'mock-unpublish',
  } satisfies Partial<PublishServiceMessagingSettings> as unknown as PublishServiceMessagingSettings,
};
