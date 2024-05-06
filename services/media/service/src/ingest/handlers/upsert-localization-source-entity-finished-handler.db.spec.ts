import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  LocalizeEntityCommand,
  UpsertLocalizationSourceEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { IngestItem } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { insert, selectOne } from 'zapatos/db';
import {
  ingest_documents,
  ingest_items,
  ingest_item_steps,
} from 'zapatos/schema';
import { CommonErrors } from '../../common';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import {
  DEFAULT_LOCALIZATION_STATE,
  UpsertLocalizationSourceEntityFinishedHandler,
} from './upsert-localization-source-entity-finished-handler';

jest.mock('../../common/utils/token-utils', () => ({
  requestServiceAccountToken: jest.fn(),
}));

describe('UpsertLocalizationSourceEntityFinishedHandler', () => {
  let ctx: ITestContext;
  let handler: UpsertLocalizationSourceEntityFinishedHandler;
  let step1: ingest_item_steps.JSONSelectable;
  let item1: ingest_items.JSONSelectable;
  let doc1: ingest_documents.JSONSelectable;
  let payloads: LocalizeEntityCommand[] = [];
  let user: AuthenticatedManagementSubject;

  const createMessage = (
    payload: UpsertLocalizationSourceEntityFinishedEvent,
    messageContext: unknown,
  ) =>
    stub<
      TypedTransactionalMessage<UpsertLocalizationSourceEntityFinishedEvent>
    >({
      payload,
      metadata: {
        messageContext,
      },
    });

  beforeAll(async () => {
    ctx = await createTestContext();
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, payload) => {
        payloads.push(payload as LocalizeEntityCommand);
      },
    );
    user = createTestUser(ctx.config.serviceId);
    handler = new UpsertLocalizationSourceEntityFinishedHandler(
      storeOutboxMessage,
      ctx.config,
    );
  });

  beforeEach(async () => {
    const item: IngestItem = {
      type: 'MOVIE',
      external_id: 'externalId',
      data: {
        title: 'title',
        localizations: [
          {
            language_tag: 'de-DE',
            title: 'Avatar – Aufbruch nach Pandora',
            description:
              'Avatar ist ein US-amerikanischer Science-Fiction-Epos aus dem Jahr 2009...',
            synopsis:
              'Im Jahr 2154 haben die Menschen die natürlichen Ressourcen der Erde erschöpft...',
          },
          {
            language_tag: 'et-EE',
            title: 'Avatar',
            description: 'Avatar on 2009. aasta Ameerika eepiline ulmefilm...',
            synopsis: 'Aastal 2154 on inimesed ammendanud Maa loodusvarad...',
          },
        ],
      },
    };
    doc1 = await insert('ingest_documents', {
      name: 'test1',
      title: 'test1',
      document: {
        name: 'test1',
        document_created: '2020-08-04T08:57:40.763+00:00',
        items: [item],
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
      item,
    }).run(ctx.ownerPool);
    step1 = await insert('ingest_item_steps', {
      id: uuid(),
      type: 'LOCALIZATIONS',
      ingest_item_id: item1.id,
      sub_type: '',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('ingest_documents');
    payloads = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('handleMessage', () => {
    it('message succeeded without errors -> localize entity message sent', async () => {
      // Arrange
      const payload: UpsertLocalizationSourceEntityFinishedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
      };
      const context = {
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
      };

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleMessage(createMessage(payload, context), dbCtx),
      );

      // Assert
      expect(payloads).toEqual<LocalizeEntityCommand[]>([
        {
          service_id: ctx.config.serviceId,
          entity_type: payload.entity_type,
          entity_id: payload.entity_id,
          localizations: [
            {
              fields: [
                {
                  field_name: 'title',
                  field_value: 'Avatar – Aufbruch nach Pandora',
                  state: DEFAULT_LOCALIZATION_STATE,
                },
                {
                  field_name: 'synopsis',
                  field_value:
                    'Im Jahr 2154 haben die Menschen die natürlichen Ressourcen der Erde erschöpft...',
                  state: DEFAULT_LOCALIZATION_STATE,
                },
                {
                  field_name: 'description',
                  field_value:
                    'Avatar ist ein US-amerikanischer Science-Fiction-Epos aus dem Jahr 2009...',
                  state: DEFAULT_LOCALIZATION_STATE,
                },
              ],
              language_tag: 'de-DE',
            },
            {
              fields: [
                {
                  field_name: 'title',
                  field_value: 'Avatar',
                  state: DEFAULT_LOCALIZATION_STATE,
                },
                {
                  field_name: 'synopsis',
                  field_value:
                    'Aastal 2154 on inimesed ammendanud Maa loodusvarad...',
                  state: DEFAULT_LOCALIZATION_STATE,
                },
                {
                  field_name: 'description',
                  field_value:
                    'Avatar on 2009. aasta Ameerika eepiline ulmefilm...',
                  state: DEFAULT_LOCALIZATION_STATE,
                },
              ],
              language_tag: 'et-EE',
            },
          ],
        },
      ]);
    });
  });

  describe('mapError', () => {
    it('message failed with non-mosaic error -> default error mapped', async () => {
      // Act
      const error = handler.mapError(new Error('Unexpected status code: 404'));

      // Assert
      expect(error).toMatchObject({
        message:
          'Processing of localizable source entity was successful, but there was an error updating the ingest item step status.',
        code: CommonErrors.IngestError.code,
      });
    });

    it('message failed with mosaic error -> thrown error mapped', async () => {
      // Arrange
      const testErrorInfo = {
        message: 'Handled test message',
        code: 'HANDLED_TEST_CODE',
      };

      // Act
      const error = handler.mapError(new MosaicError(testErrorInfo));

      // Assert
      expect(error).toMatchObject(testErrorInfo);
    });
  });

  describe('handleErrorMessage', () => {
    it('message failed on all retries -> step updated', async () => {
      // Arrange
      const payload: UpsertLocalizationSourceEntityFinishedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
      };
      const context = {
        ingestItemId: item1.id,
      };
      // mapError makes sure this error is appropriate
      const error = new Error('Handled and mapped message');

      // Act
      await ctx.executeOwnerSql(user, async (dbCtx) =>
        handler.handleErrorMessage(
          error,
          createMessage(payload, context),
          dbCtx,
          false,
        ),
      );

      // Assert
      const step = await selectOne('ingest_item_steps', {
        id: step1.id,
      }).run(ctx.ownerPool);
      expect(step?.response_message).toEqual(error.message);
      expect(step?.status).toEqual('ERROR');
    });
  });
});
