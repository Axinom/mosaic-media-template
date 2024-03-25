import { UNKNOWN_AGGREGATE_ID } from '@axinom/mosaic-message-bus';
import {
  ImageServiceMultiTenantMessagingSettings,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  StartIngestItemCommand,
} from 'media-messages';
import { createTestConfig } from '../../../tests/test-utils';
import { IngestMovieProcessor } from './ingest-movie-processor';

const ingestStepId = '849c11f1-c188-4950-9743-442c45c5c8e5';
jest.mock('uuid', () => ({
  v4: () => ingestStepId,
}));

describe('IngestMovieProcessor', () => {
  let processor: IngestMovieProcessor;
  const ingestItemId = 1;
  const mediaId = 2;

  const metaData = (item: StartIngestItemCommand['item']) => ({
    aggregateId: mediaId.toString(),
    ingestItemStep: {
      id: ingestStepId,
      ingest_item_id: ingestItemId,
      sub_type: 'METADATA',
      type: 'ENTITY',
      entity_id: mediaId.toString(),
    },
    messageContext: {
      ingestItemId: ingestItemId,
      ingestItemStepId: ingestStepId,
    },
    messagePayload: {
      entity_id: mediaId,
      item,
    },
    messagingSettings: MediaServiceMessagingSettings.UpdateMetadata,
  });
  const videoData = (item: StartIngestItemCommand['item']) => ({
    aggregateId: UNKNOWN_AGGREGATE_ID,
    ingestItemStep: {
      id: ingestStepId,
      ingest_item_id: ingestItemId,
      sub_type: 'MAIN',
      type: 'VIDEO',
    },
    messageContext: {
      ingestItemId: ingestItemId,
      ingestItemStepId: ingestStepId,
      videoType: 'MAIN',
    },
    messagePayload: {
      tags: ['MAIN'],
      video_location: 'v1',
      video_profile: (item.data.main_video as any).profile ?? 'DEFAULT',
    },
    messagingSettings:
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
  });
  const trailer1Data = (item: StartIngestItemCommand['item']) => ({
    aggregateId: UNKNOWN_AGGREGATE_ID,
    ingestItemStep: {
      id: ingestStepId,
      ingest_item_id: ingestItemId,
      sub_type: 'TRAILER',
      type: 'VIDEO',
    },
    messageContext: {
      ingestItemId: ingestItemId,
      ingestItemStepId: ingestStepId,
      videoType: 'TRAILER',
    },
    messagePayload: {
      tags: ['TRAILER'],
      video_location: 't1',
      video_profile: (item.data.main_video as any).profile ?? 'DEFAULT',
    },
    messagingSettings:
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
  });
  const trailer2Data = (item: StartIngestItemCommand['item']) => ({
    aggregateId: UNKNOWN_AGGREGATE_ID,
    ingestItemStep: {
      id: ingestStepId,
      ingest_item_id: ingestItemId,
      sub_type: 'TRAILER',
      type: 'VIDEO',
    },
    messageContext: {
      ingestItemId: ingestItemId,
      ingestItemStepId: ingestStepId,
      videoType: 'TRAILER',
    },
    messagePayload: {
      tags: ['TRAILER'],
      video_location: 't2',
      video_profile: (item.data.main_video as any).profile ?? 'DEFAULT',
    },
    messagingSettings:
      VideoServiceMultiTenantMessagingSettings.EnsureVideoExists,
  });
  const teaserData = () => ({
    aggregateId: UNKNOWN_AGGREGATE_ID,
    ingestItemStep: {
      id: ingestStepId,
      ingest_item_id: ingestItemId,
      sub_type: 'TEASER',
      type: 'IMAGE',
    },
    messageContext: {
      ingestItemId: ingestItemId,
      ingestItemStepId: ingestStepId,
      imageType: 'TEASER',
    },
    messagePayload: {
      image_location: 'images/teasers/test2.jpg',
      image_type: 'movie_teaser',
    },
    messagingSettings:
      ImageServiceMultiTenantMessagingSettings.EnsureImageExists,
  });
  const coverData = () => ({
    aggregateId: UNKNOWN_AGGREGATE_ID,
    ingestItemStep: {
      id: ingestStepId,
      ingest_item_id: ingestItemId,
      sub_type: 'COVER',
      type: 'IMAGE',
    },
    messageContext: {
      ingestItemId: ingestItemId,
      ingestItemStepId: ingestStepId,
      imageType: 'COVER',
    },
    messagePayload: {
      image_location: 'images/covers/test.jpg',
      image_type: 'movie_cover',
    },
    messagingSettings:
      ImageServiceMultiTenantMessagingSettings.EnsureImageExists,
  });
  const localizationsData = () => ({
    ingestItemStep: {
      id: ingestStepId,
      ingest_item_id: ingestItemId,
      sub_type: '',
      type: 'LOCALIZATIONS',
    },
  });

  beforeAll(async () => {
    const config = createTestConfig();
    processor = new IngestMovieProcessor(config);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('getOrchestrationData', () => {
    it.each([
      [undefined, undefined, undefined, undefined, [metaData]],
      [null, null, null, null, [metaData]],
      [{ source: 'v1' }, null, null, null, [metaData, videoData]],
      [
        null,
        null,
        null,
        [
          { language_tag: 'de-DE', title: 'Avatar – Aufbruch nach Pandora' },
          { language_tag: 'et-EE', title: 'Avatar' },
        ],
        [metaData, localizationsData],
      ],
      [
        { source: 'v1', profile: 'DEFAULT' },
        null,
        [{ path: 'images\\teasers\\test2.jpg', type: 'TEASER' }],
        [],
        [metaData, videoData, teaserData],
      ],
      [
        { source: 'v1', profile: 'DEFAULT' },
        [{ source: 't1' }],
        null,
        null,
        [metaData, videoData, trailer1Data],
      ],
      [
        { source: 'v1', profile: 'DEFAULT' },
        [{ source: 't1', profile: 'DEFAULT' }],
        [{ path: 'images/covers/test.jpg', type: 'COVER' }],
        null,
        [metaData, videoData, trailer1Data, coverData],
      ],
      [
        { source: 'v1', profile: 'SomeProfile' },
        [
          { source: 't1', profile: 'SomeProfile' },
          { source: 't2', profile: 'SomeProfile' },
        ],
        [
          { path: 'images/covers/test.jpg', type: 'COVER' },
          { path: 'images\\teasers\\test2.jpg', type: 'TEASER' },
        ],
        [
          { language_tag: 'de-DE', title: 'Avatar – Aufbruch nach Pandora' },
          { language_tag: 'et-EE', title: 'Avatar' },
        ],
        [
          metaData,
          videoData,
          trailer1Data,
          trailer2Data,
          coverData,
          teaserData,
          localizationsData,
        ],
      ],
    ])(
      'full movie message with various relations -> orchestration data with relevant steps',
      async (mainVideo, trailers, images, localizations, dataConstructors) => {
        // Arrange
        const item: StartIngestItemCommand['item'] = {
          type: 'MOVIE',
          external_id: 'externalId',
          data: {
            title: 'title',
            main_video: mainVideo,
            trailers,
            images,
            localizations,
          },
        };
        const content: StartIngestItemCommand = {
          ingest_item_id: ingestItemId,
          entity_id: mediaId,
          item,
        };

        // Act
        const data = processor.getOrchestrationData(content);

        // Assert
        expect(data).toEqual(
          dataConstructors.map((create: any) => create(item)),
        );
      },
    );
  });
});
