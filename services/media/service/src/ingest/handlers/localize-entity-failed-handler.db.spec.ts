import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { LocalizeEntityFailedEvent } from '@axinom/mosaic-messages';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand } from 'media-messages';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { LocalizeEntityFailedHandler } from './localize-entity-failed-handler';

describe('LocalizeEntityFailedHandler', () => {
  let ctx: ITestContext;
  let handler: LocalizeEntityFailedHandler;
  let payloads: CheckFinishIngestItemCommand[] = [];
  let user: AuthenticatedManagementSubject;

  const createMessage = (
    payload: LocalizeEntityFailedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizeEntityFailedEvent>>({
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
      },
    );
    user = createTestUser(ctx.config.serviceId);
    handler = new LocalizeEntityFailedHandler(storeOutboxMessage, ctx.config);
  });

  afterEach(async () => {
    payloads = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message received -> message with error ingestItemStepId sent', async () => {
      // Arrange
      const payload: LocalizeEntityFailedEvent = {
        message: 'Test error message',
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
      };
      const context = {
        ingestItemStepId: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingestItemId: 1,
        imageType: 'MAIN',
      };

      // Act
      await ctx.executeGqlSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      expect(payloads).toHaveLength(1);
      expect(payloads[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingest_item_id: 1,
        error_message: payload.message,
      });
    });
  });
});
