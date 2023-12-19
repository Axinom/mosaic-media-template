import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TransactionalInboxMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  CheckFinishIngestItemCommand,
  UpdateMetadataCommand,
} from 'media-messages';
import { OutboxMessage } from 'pg-transactional-outbox';
import { CommonErrors } from '../../common';
import { MockIngestProcessor } from '../../tests/ingest/mock-ingest-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { UpdateMetadataHandler } from './update-metadata-handler';

describe('UpdateMetadataHandler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: UpdateMetadataHandler;
  let payloads: CheckFinishIngestItemCommand[] = [];

  const createMessage = (
    payload: UpdateMetadataCommand,
    messageContext: unknown,
  ) =>
    stub<TransactionalInboxMessage<UpdateMetadataCommand>>({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, payload) => {
        payloads.push(payload as CheckFinishIngestItemCommand);
        return Promise.resolve(stub<OutboxMessage>());
      },
    );
    user = createTestUser(ctx.config.serviceId);
    handler = new UpdateMetadataHandler(
      [new MockIngestProcessor()],
      storeOutboxMessage,
      ctx.config,
    );
  });

  afterEach(async () => {
    payloads = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> message without error sent', async () => {
      // Arrange
      const payload: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
      const context = {
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
      };

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      expect(payloads).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
          ingest_item_id: 1,
        },
      ]);
    });
  });

  describe('onMessageFailure', () => {
    it('message failed on all retries with non-ingest error -> message with ingest_item_step_id and generic errorMessage sent', async () => {
      // Arrange
      const payload: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
      const context = {
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
      };

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          new Error('test error'),
          createMessage(payload, context),
          dbCtx,
          false,
        ),
      );

      // Assert
      expect(payloads).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
          ingest_item_id: 1,
          error_message: 'Unexpected error occurred while updating metadata.',
        },
      ]);
    });

    it('message failed on all retries with ingest error -> message with ingest_item_step_id and genre update errorMessage sent', async () => {
      // Arrange
      const payload: UpdateMetadataCommand = stub<UpdateMetadataCommand>({
        item: { type: 'MOVIE' },
      });
      const errorMessage =
        'Metadata update has failed because following genres do not exist: Non-existent1, Non-existent2';
      const context = {
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: 1,
      };

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          new MosaicError({
            message: errorMessage,
            code: CommonErrors.IngestError.code,
          }),
          createMessage(payload, context),
          dbCtx,
          false,
        ),
      );

      // Assert
      expect(payloads).toEqual<CheckFinishIngestItemCommand[]>([
        {
          ingest_item_step_id: '8331d916-575e-4555-99da-ac820d456a7b',
          ingest_item_id: 1,
          error_message: errorMessage,
        },
      ]);
    });
  });
});
