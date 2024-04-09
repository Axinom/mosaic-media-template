import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { LocalizeEntityFinishedEvent } from '@axinom/mosaic-messages';
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
import { LocalizeEntityFinishedHandler } from './localize-entity-finished-handler';

describe('LocalizeEntityFinishedHandler', () => {
  let ctx: ITestContext;
  let handler: LocalizeEntityFinishedHandler;
  let payloads: CheckFinishIngestItemCommand[] = [];
  let user: AuthenticatedManagementSubject;

  const createMessage = (
    payload: LocalizeEntityFinishedEvent,
    messageContext: unknown,
  ) =>
    stub<TypedTransactionalMessage<LocalizeEntityFinishedEvent>>({
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
    handler = new LocalizeEntityFinishedHandler(storeOutboxMessage, ctx.config);
  });

  afterEach(async () => {
    payloads = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message received -> check ingest item message without error sent', async () => {
      // Arrange
      const payload: LocalizeEntityFinishedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
        skipped_language_tags: [],
        processed_language_tags: ['de-DE'],
      };
      const context = {
        ingestItemStepId: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingestItemId: 1,
        imageType: 'MAIN',
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      expect(payloads).toHaveLength(1);
      expect(payloads[0]).toEqual<CheckFinishIngestItemCommand>({
        ingest_item_step_id: '34d91ea5-db63-4e51-b511-ae545d5c669c',
        ingest_item_id: 1,
      });
    });
  });
});
