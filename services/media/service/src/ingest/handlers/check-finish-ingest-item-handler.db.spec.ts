import { MessageInfo } from '@axinom/mosaic-message-bus';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { all, insert, select, selectExactlyOne } from 'zapatos/db';
import {
  ingest_documents,
  ingest_items,
  ingest_item_steps,
} from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { CheckFinishIngestItemHandler } from './check-finish-ingest-item-handler';

describe('Check Finish Ingest Item Handler', () => {
  let ctx: ITestContext;
  let handler: CheckFinishIngestItemHandler;
  let doc1: ingest_documents.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let step1: ingest_item_steps.JSONSelectable;
  let message: MessageInfo;

  beforeAll(async () => {
    ctx = await createTestContext();
    const user = createTestUser(ctx.config.serviceId);
    message = stub<MessageInfo>({
      envelope: {
        auth_token:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
      },
    });
    handler = new CheckFinishIngestItemHandler(ctx.loginPool, ctx.config);

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
        items: [{ type: 'MOVIE', external_id: 'test', data: {} }],
      },
      items_count: 1,
      in_progress_count: 1,
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
        external_id: 'test',
        data: { title: 'title' },
      },
    }).run(ctx.ownerPool);
    step1 = await insert('ingest_item_steps', {
      id: uuid(),
      ingest_item_id: item1.id,
      sub_type: 'METADATA',
      type: 'ENTITY',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message with matching ingest_item_step_id without error_message -> item and document success', async () => {
      // Arrange
      const content: CheckFinishIngestItemCommand = {
        ingest_item_id: item1.id,
        ingest_item_step_id: step1.id,
      };

      // Act
      await handler.onMessage(content, message);

      // Assert
      const steps = await select('ingest_item_steps', all).run(ctx.ownerPool);
      const items = await select('ingest_items', all).run(ctx.ownerPool);
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);

      expect(steps).toHaveLength(1);
      expect(items).toHaveLength(1);
      expect(docs).toHaveLength(1);

      expect(steps[0].id).toEqual(step1.id);
      expect(steps[0].status).toEqual('SUCCESS');
      expect(steps[0].response_message).toBeNull();

      expect(items[0].status).toEqual('SUCCESS');
      expect(items[0].errors).toEqual([]);

      expect(items[0].status).toEqual('SUCCESS');
      expect(items[0].errors).toEqual([]);

      // Calculation done in separate handler
      expect(docs[0].in_progress_count).toEqual(1);
      expect(docs[0].error_count).toEqual(0);
      expect(docs[0].success_count).toEqual(0);
      expect(docs[0].status).toEqual('IN_PROGRESS');
      expect(docs[0].errors).toEqual([]);
    });

    it('message with matching ingest_item_step_id without error_message received 2 times -> item and document success, correct progress counts', async () => {
      // Arrange
      const content: CheckFinishIngestItemCommand = {
        ingest_item_id: item1.id,
        ingest_item_step_id: step1.id,
      };

      // Act
      await Promise.all([
        handler.onMessage(content, message),
        handler.onMessage(content, message),
      ]);

      // Assert
      const steps = await select('ingest_item_steps', all).run(ctx.ownerPool);
      const items = await select('ingest_items', all).run(ctx.ownerPool);
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);

      expect(steps).toHaveLength(1);
      expect(items).toHaveLength(1);
      expect(docs).toHaveLength(1);

      expect(steps[0].id).toEqual(step1.id);
      expect(steps[0].status).toEqual('SUCCESS');
      expect(steps[0].response_message).toBeNull();

      expect(items[0].status).toEqual('SUCCESS');
      expect(items[0].errors).toEqual([]);

      // Calculation done in separate handler
      expect(docs[0].in_progress_count).toEqual(1);
      expect(docs[0].error_count).toEqual(0);
      expect(docs[0].success_count).toEqual(0);
      expect(docs[0].status).toEqual('IN_PROGRESS');
      expect(docs[0].errors).toEqual([]);
    });

    it('single message with error_message -> item and document error', async () => {
      // Arrange
      const content: CheckFinishIngestItemCommand = {
        ingest_item_id: item1.id,
        ingest_item_step_id: step1.id,
        error_message: 'Test error message.',
      };

      // Act
      await handler.onMessage(content, message);

      // Assert
      const steps = await select('ingest_item_steps', all).run(ctx.ownerPool);
      const items = await select('ingest_items', all).run(ctx.ownerPool);
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);

      expect(steps).toHaveLength(1);
      expect(items).toHaveLength(1);
      expect(docs).toHaveLength(1);

      expect(steps[0].id).toEqual(step1.id);
      expect(steps[0].status).toEqual('ERROR');
      expect(steps[0].response_message).toEqual(content.error_message);

      expect(items[0].status).toEqual('ERROR');
      expect(items[0].errors).toEqual([]);

      // Calculation done in separate handler
      expect(docs[0].in_progress_count).toEqual(1);
      expect(docs[0].error_count).toEqual(0);
      expect(docs[0].success_count).toEqual(0);
      expect(docs[0].status).toEqual('IN_PROGRESS');
      expect(docs[0].errors).toEqual([]);
    });

    it('first message with matching ingest_item_step_id and 2 sent messages -> item and document in_progress', async () => {
      // Arrange
      const doc = await insert('ingest_documents', {
        name: 'test1',
        title: 'test1',
        document: {
          name: 'test1',
          document_created: '2020-08-04T08:57:40.763+00:00',
          items: [{ type: 'MOVIE', external_id: 'test', data: {} }],
        },
        items_count: 1,
        in_progress_count: 1,
      }).run(ctx.ownerPool);
      const item = await insert('ingest_items', {
        ingest_document_id: doc.id,
        external_id: 'externalId',
        entity_id: 1,
        type: 'MOVIE',
        exists_status: 'CREATED',
        display_title: 'title',
        item: {
          type: 'MOVIE',
          external_id: 'test',
          data: { title: 'title' },
        },
      }).run(ctx.ownerPool);

      const metadataId = uuid();
      const videoId = uuid();
      await insert('ingest_item_steps', [
        {
          ingest_item_id: item.id,
          sub_type: 'METADATA',
          type: 'ENTITY',
          id: metadataId,
        },
        {
          ingest_item_id: item.id,
          sub_type: 'MAIN',
          type: 'VIDEO',
          id: videoId,
        },
      ]).run(ctx.ownerPool);

      const content: CheckFinishIngestItemCommand = {
        ingest_item_id: item.id,
        ingest_item_step_id: metadataId,
      };

      // Act
      await handler.onMessage(content, message);

      // Assert
      const steps = await select(
        'ingest_item_steps',
        { ingest_item_id: item.id },
        { columns: ['status', 'response_message', 'id'] },
      ).run(ctx.ownerPool);
      const updatedItem = await selectExactlyOne('ingest_items', {
        id: item.id,
      }).run(ctx.ownerPool);
      const notUpdatedDoc = await selectExactlyOne('ingest_documents', {
        id: doc.id,
      }).run(ctx.ownerPool);

      expect(steps).toIncludeSameMembers([
        {
          response_message: null,
          status: 'IN_PROGRESS',
          id: videoId,
        },
        {
          response_message: null,
          status: 'SUCCESS',
          id: metadataId,
        },
      ]);

      expect(updatedItem.status).toEqual('IN_PROGRESS');
      expect(updatedItem.errors).toEqual([]);

      // Calculation done in separate handler
      expect(notUpdatedDoc.in_progress_count).toEqual(1);
      expect(notUpdatedDoc.error_count).toEqual(0);
      expect(notUpdatedDoc.success_count).toEqual(0);
      expect(notUpdatedDoc.status).toEqual('IN_PROGRESS');
      expect(notUpdatedDoc.errors).toEqual([]);
    });

    it('Single item in document, first error received -> ingest item is still in progress', async () => {
      // Arrange
      const doc = await insert('ingest_documents', {
        name: 'test1',
        title: 'test1',
        document: {
          name: 'test1',
          document_created: '2020-08-04T08:57:40.763+00:00',
          items: [{ type: 'MOVIE', external_id: 'test', data: {} }],
        },
        items_count: 1,
        in_progress_count: 1,
      }).run(ctx.ownerPool);
      const item = await insert('ingest_items', {
        ingest_document_id: doc.id,
        external_id: 'externalId',
        entity_id: 1,
        type: 'MOVIE',
        exists_status: 'CREATED',
        display_title: 'title',
        item: {
          type: 'MOVIE',
          external_id: 'test',
          data: { title: 'title' },
        },
      }).run(ctx.ownerPool);

      const metadataId = uuid();
      const videoId = uuid();
      const trailerId1 = uuid();
      const trailerId2 = uuid();
      await insert('ingest_item_steps', [
        {
          ingest_item_id: item.id,
          status: 'SUCCESS',
          sub_type: 'METADATA',
          type: 'ENTITY',
          id: metadataId,
        },
        {
          ingest_item_id: item.id,
          sub_type: 'MAIN',
          type: 'VIDEO',
          id: videoId,
        },
        {
          ingest_item_id: item.id,
          sub_type: 'MAIN',
          type: 'VIDEO',
          id: trailerId1,
        },
        {
          ingest_item_id: item.id,
          sub_type: 'MAIN',
          type: 'VIDEO',
          id: trailerId2,
        },
      ]).run(ctx.ownerPool);

      // Act
      await handler.onMessage(
        {
          ingest_item_id: item.id,
          ingest_item_step_id: videoId,
          error_message:
            'Unexpected error occurred while ensuring that video exists.',
        },
        message,
      );

      // Assert
      const steps = await select(
        'ingest_item_steps',
        { ingest_item_id: item.id },
        { columns: ['id', 'status', 'response_message'] },
      ).run(ctx.ownerPool);
      const updatedItem = await selectExactlyOne('ingest_items', {
        id: item.id,
      }).run(ctx.ownerPool);
      const notUpdatedDoc = await selectExactlyOne('ingest_documents', {
        id: doc.id,
      }).run(ctx.ownerPool);

      expect(steps).toIncludeSameMembers([
        {
          id: metadataId,
          response_message: null,
          status: 'SUCCESS',
        },
        {
          id: trailerId1,
          response_message: null,
          status: 'IN_PROGRESS',
        },
        {
          id: trailerId2,
          response_message: null,
          status: 'IN_PROGRESS',
        },
        {
          id: videoId,
          response_message:
            'Unexpected error occurred while ensuring that video exists.',
          status: 'ERROR',
        },
      ]);

      expect(updatedItem.status).toEqual('IN_PROGRESS');
      expect(updatedItem.errors).toEqual([]);

      // Calculation done in separate handler
      expect(notUpdatedDoc.in_progress_count).toEqual(1);
      expect(notUpdatedDoc.error_count).toEqual(0);
      expect(notUpdatedDoc.success_count).toEqual(0);
      expect(notUpdatedDoc.status).toEqual('IN_PROGRESS');
      expect(notUpdatedDoc.errors).toEqual([]);
    });

    it('Single item in document, multiple error messages received -> document has correct in_progress count and errors count', async () => {
      // Arrange
      const doc = await insert('ingest_documents', {
        name: 'test1',
        title: 'test1',
        document: {
          name: 'test1',
          document_created: '2020-08-04T08:57:40.763+00:00',
          items: [{ type: 'MOVIE', external_id: 'test', data: {} }],
        },
        items_count: 1,
        in_progress_count: 1,
      }).run(ctx.ownerPool);
      const item = await insert('ingest_items', {
        ingest_document_id: doc.id,
        external_id: 'externalId',
        entity_id: 1,
        type: 'MOVIE',
        exists_status: 'CREATED',
        display_title: 'title',
        item: {
          type: 'MOVIE',
          external_id: 'test',
          data: { title: 'title' },
        },
      }).run(ctx.ownerPool);

      const metadataId = uuid();
      const videoId = uuid();
      const trailerId1 = uuid();
      const trailerId2 = uuid();
      await insert('ingest_item_steps', [
        {
          id: metadataId,
          ingest_item_id: item.id,
          status: 'SUCCESS',
          sub_type: 'METADATA',
          type: 'ENTITY',
        },
        {
          id: videoId,
          ingest_item_id: item.id,
          sub_type: 'MAIN',
          type: 'VIDEO',
        },
        {
          id: trailerId1,
          ingest_item_id: item.id,
          sub_type: 'MAIN',
          type: 'VIDEO',
        },
        {
          id: trailerId2,
          ingest_item_id: item.id,
          sub_type: 'MAIN',
          type: 'VIDEO',
        },
      ]).run(ctx.ownerPool);

      // Act
      await handler.onMessage(
        {
          ingest_item_id: item.id,
          ingest_item_step_id: videoId,
          error_message: `An unexpected error occurred while trying to ensure that video exists 1.`,
        },
        message,
      );
      await handler.onMessage(
        {
          ingest_item_id: item.id,
          ingest_item_step_id: trailerId1,
          error_message: `An unexpected error occurred while trying to ensure that video exists 2.`,
        },
        message,
      );
      await handler.onMessage(
        {
          ingest_item_id: item.id,
          ingest_item_step_id: trailerId2,
          error_message: `An unexpected error occurred while trying to ensure that video exists 3.`,
        },
        message,
      );

      // Assert
      const steps = await select(
        'ingest_item_steps',
        { ingest_item_id: item.id },
        { columns: ['id', 'status', 'response_message'] },
      ).run(ctx.ownerPool);
      const updatedItem = await selectExactlyOne('ingest_items', {
        id: item.id,
      }).run(ctx.ownerPool);
      const notUpdatedDoc = await selectExactlyOne('ingest_documents', {
        id: doc.id,
      }).run(ctx.ownerPool);

      expect(steps).toIncludeSameMembers([
        {
          id: metadataId,
          response_message: null,
          status: 'SUCCESS',
        },
        {
          id: trailerId1,
          response_message:
            'An unexpected error occurred while trying to ensure that video exists 2.',
          status: 'ERROR',
        },
        {
          id: trailerId2,
          response_message:
            'An unexpected error occurred while trying to ensure that video exists 3.',
          status: 'ERROR',
        },
        {
          id: videoId,
          response_message:
            'An unexpected error occurred while trying to ensure that video exists 1.',
          status: 'ERROR',
        },
      ]);
      expect(updatedItem.status).toEqual('ERROR');
      expect(updatedItem.errors).toEqual([]);

      // Calculation done in separate handler
      expect(notUpdatedDoc.in_progress_count).toEqual(1);
      expect(notUpdatedDoc.error_count).toEqual(0);
      expect(notUpdatedDoc.success_count).toEqual(0);
      expect(notUpdatedDoc.status).toEqual('IN_PROGRESS');
      expect(notUpdatedDoc.errors).toEqual([]);
    });

    it('message for two failed items -> item errors', async () => {
      // Arrange
      const doc2 = await insert('ingest_documents', {
        name: 'test2',
        title: 'test2',
        document: {
          name: 'test2',
          document_created: '2020-08-04T08:57:40.763+00:00',
          items: [
            { external_id: 'test2', type: 'MOVIE', data: {} },
            { external_id: 'test3', type: 'MOVIE', data: {} },
          ],
        },
        items_count: 2,
        in_progress_count: 2,
      }).run(ctx.ownerPool);
      const item2 = await insert('ingest_items', {
        ingest_document_id: doc2.id,
        external_id: 'test2',
        entity_id: 2,
        type: 'MOVIE',
        exists_status: 'CREATED',
        display_title: 'title',
        item: {
          type: 'MOVIE',
          external_id: 'test2',
          data: { title: 'title' },
        },
      }).run(ctx.ownerPool);
      const item3 = await insert('ingest_items', {
        ingest_document_id: doc2.id,
        external_id: 'test3',
        entity_id: 3,
        type: 'MOVIE',
        exists_status: 'CREATED',
        display_title: 'title',
        item: {
          type: 'MOVIE',
          external_id: 'test3',
          data: { title: 'title' },
        },
      }).run(ctx.ownerPool);

      const metadataId1 = uuid();
      const metadataId2 = uuid();
      await insert('ingest_item_steps', [
        {
          id: metadataId1,
          ingest_item_id: item2.id,
          sub_type: 'METADATA',
          type: 'ENTITY',
        },
        {
          id: metadataId2,
          ingest_item_id: item3.id,
          sub_type: 'METADATA',
          type: 'ENTITY',
        },
      ]).run(ctx.ownerPool);

      const content1: CheckFinishIngestItemCommand = {
        ingest_item_id: item2.id,
        ingest_item_step_id: metadataId1,
        error_message: 'Test error message 1',
      };

      const content2: CheckFinishIngestItemCommand = {
        ingest_item_id: item3.id,
        ingest_item_step_id: metadataId2,
        error_message: 'Test error message 2',
      };

      // Act
      await handler.onMessage(content1, message);
      await handler.onMessage(content2, message);

      // Assert
      const step2 = await selectExactlyOne('ingest_item_steps', {
        ingest_item_id: item2.id,
      }).run(ctx.ownerPool);
      const step3 = await selectExactlyOne('ingest_item_steps', {
        ingest_item_id: item3.id,
      }).run(ctx.ownerPool);
      const items = await select('ingest_items', all).run(ctx.ownerPool);
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);

      expect(items).toHaveLength(3);
      expect(docs).toHaveLength(2);

      expect(step2.status).toEqual('ERROR');
      expect(step2.response_message).toBe(content1.error_message);

      expect(items[1].status).toEqual('ERROR');
      expect(items[1].errors).toEqual([]);

      expect(step3.status).toEqual('ERROR');
      expect(step3.response_message).toBe(content2.error_message);

      expect(items[2].status).toEqual('ERROR');
      expect(items[2].errors).toEqual([]);

      // Calculation done in separate handler
      expect(docs[1].in_progress_count).toEqual(2);
      expect(docs[1].error_count).toEqual(0);
      expect(docs[1].success_count).toEqual(0);
      expect(docs[1].status).toEqual('IN_PROGRESS');
      expect(docs[1].errors).toEqual([]);
    });
  });
});
