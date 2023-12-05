import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  LocalizeEntityCommand,
  UpsertLocalizationSourceEntityFinishedEvent,
} from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { CheckFinishIngestItemCommand, IngestItem } from 'media-messages';
import { v4 as uuid } from 'uuid';
import { all, insert, select } from 'zapatos/db';
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

describe('UpsertLocalizationSourceEntityFinishedHandler', () => {
  let ctx: ITestContext;
  let handler: UpsertLocalizationSourceEntityFinishedHandler;
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
    handler = new UpsertLocalizationSourceEntityFinishedHandler(
      broker,
      ctx.loginPool,
      ctx.config,
    );

    jest
      .spyOn<any, string>(handler, 'getSubject')
      .mockImplementation(() => user);
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
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message succeeded without errors -> localize entity message sent', async () => {
      // Arrange
      const content: UpsertLocalizationSourceEntityFinishedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
      };
      const message = createMessage({
        ingestItemStepId: step1.id,
        ingestItemId: item1.id,
      });

      // Act
      await handler.onMessage(content, message);

      // Assert
      expect(messages).toEqual<LocalizeEntityCommand[]>([
        {
          service_id: ctx.config.serviceId,
          entity_type: content.entity_type,
          entity_id: content.entity_id,
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

  describe('onMessageFailure', () => {
    it('message failed on all retries -> message with error sent', async () => {
      // Arrange
      const content: UpsertLocalizationSourceEntityFinishedEvent = {
        service_id: ctx.config.serviceId,
        entity_id: '1',
        entity_type: 'movie',
      };
      const message = createMessage({
        ingestItemStepId: '8331d916-575e-4555-99da-ac820d456a7b',
        ingestItemId: item1.id,
      });
      const error = new MosaicError({
        message:
          'An error occurred while trying to process a response event from the localization service.',
        code: CommonErrors.IngestError.code,
      });

      // Act
      await handler.onMessageFailure(content, message, error);

      // Assert
      const docs = await select('ingest_documents', all).run(ctx.ownerPool);
      const items = await select('ingest_items', all).run(ctx.ownerPool);

      expect(docs).toHaveLength(1);

      // Calculation done in separate handler
      expect(docs[0].status).toEqual('IN_PROGRESS');
      expect(docs[0].error_count).toEqual(0);
      expect(docs[0].in_progress_count).toEqual(1);
      expect(docs[0].success_count).toEqual(0);
      expect(docs[0].items_count).toEqual(1);

      expect(items).toHaveLength(1);
      expect(items[0].status).toEqual('ERROR');
      expect(items[0].errors).toEqual([
        {
          message: error.message,
          source: 'UpsertLocalizationSourceEntityFinishedHandler',
        },
      ]);
    });
  });
});
