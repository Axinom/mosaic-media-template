import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import { EnsureVideoExistsCreationStartedEvent } from '@axinom/mosaic-messages';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import {
  ingest_documents,
  ingest_items,
  ingest_item_steps,
} from 'zapatos/schema';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { VideoCreationStartedHandler } from './video-creation-started-handler';

// These tests cover logic for both VideoAlreadyExisted and VideoCreationStarted handlers
describe('VideoSucceededHandler', () => {
  let ctx: ITestContext;
  let handler: VideoCreationStartedHandler;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;
  let messages: CheckFinishIngestItemCommand[] = [];

  const createMessage = (messageContext: unknown = {}): MessageInfo => {
    return stub<MessageInfo>({
      envelope: {
        auth_token:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
        message_context: messageContext,
      },
    });
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    const broker = stub<Broker>({
      publish: (
        _id: string,
        _settings: unknown,
        message: CheckFinishIngestItemCommand,
      ) => {
        messages.push(message);
      },
    });
    const user = createTestUser(ctx.config.serviceId);
    handler = new VideoCreationStartedHandler(
      [new MockIngestProcessor()],
      broker,
      ctx.loginPool,
      ctx.config,
    );

    jest
      .spyOn<any, string>(handler, 'getSubject')
      .mockImplementation(() => user);
  });

  beforeEach(async () => {
    doc1 = await insert('ingest_documents', {
      name: 'test1',
      title: 'test1',
      document: {
        name: 'test1',
        document_created: '2020-08-04T08:57:40.763+00:00',
        items: [],
      },
      items_count: 0,
    }).run(ctx.ownerPool);
    item1 = await insert('ingest_items', {
      ingest_document_id: doc1.id,
      external_id: 'externalId',
      entity_id: 1,
      type: 'MOVIE',
      exists_status: 'CREATED',
      display_title: 'title',
      item: {
        type: 'MOVIE',
        external_id: 'externalId',
        data: {
          title: 'title',
          trailers: [{ source: 'test', profile: 'DEFAULT' }],
        },
      },
    }).run(ctx.ownerPool);
    step1 = await insert('ingest_item_steps', {
      id: uuid(),
      type: 'VIDEO',
      ingest_item_id: item1.id,
      sub_type: 'MAIN',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> message without error sent and step updated', async () => {
      // Arrange
      const content: EnsureVideoExistsCreationStartedEvent = {
        video_id: '6804e7ff-8bed-42b2-85bf-c1ca5b59c417',
        encoding_state: 'IN_PROGRESS',
      };
      const message = createMessage({
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
        videoType: 'MAIN',
      });

      // Act
      await handler.onMessage(content, message);

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);

      expect(step?.entity_id).toEqual(content.video_id);

      expect(messages).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: step1.id,
          ingest_item_id: item1.id,
        },
      ]);
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries -> message with error sent', async () => {
      // Arrange
      const content: EnsureVideoExistsCreationStartedEvent = {
        video_id: '6804e7ff-8bed-42b2-85bf-c1ca5b59c417',
        encoding_state: 'IN_PROGRESS',
      };
      const message = createMessage({
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: item1.id,
        videoType: 'MAIN',
      });

      // Act
      await handler.onMessageFailure(content, message, new Error('test error'));

      // Assert
      expect(messages).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
          ingest_item_id: item1.id,
          error_message:
            'An unexpected error occurred while trying to update video relations.',
        },
      ]);
    });
  });
});
