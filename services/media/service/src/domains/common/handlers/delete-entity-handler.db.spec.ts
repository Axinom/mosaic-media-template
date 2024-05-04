import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { DeleteEntityCommand } from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { DeleteEntityHandler } from './delete-entity-handler';

describe('Start Ingest Item Handler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: DeleteEntityHandler;
  let movie1: movies.JSONSelectable;
  let movie2: movies.JSONSelectable;
  let movie3: movies.JSONSelectable;
  let messages: unknown[] = [];

  const createMessage = (payload: DeleteEntityCommand) =>
    stub<TypedTransactionalMessage<DeleteEntityCommand>>({
      payload,
    });

  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = jest.fn(
      async (_aggregateId, _messagingSettings, message) => {
        messages.push(message);
      },
    );
    ctx = await createTestContext({}, storeOutboxMessage);
    user = createTestUser(ctx.config.serviceId);
    handler = new DeleteEntityHandler(storeOutboxMessage, ctx.config);
  });

  beforeEach(async () => {
    movie1 = await insert('movies', {
      title: 'movie1',
      external_id: 'movie1',
      released: '2021-01-01',
    }).run(ctx.ownerPool);
    movie2 = await insert('movies', {
      title: 'movie2',
      external_id: 'movie2',
      released: '2021-02-02',
    }).run(ctx.ownerPool);
    movie3 = await insert('movies', {
      title: 'movie3',
      external_id: 'movie3',
      released: '2021-03-03',
    }).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  test('Make sure the sent item IDs are deleted', async () => {
    // Arrange
    const tableName: movies.Table = 'movies';
    const payload: DeleteEntityCommand = {
      table_name: tableName,
      entity_id: movie1.id,
      primary_key_name: 'id',
    };

    // Act
    await ctx.executeGqlSql(user, async (dbCtx) =>
      handler.handleMessage(createMessage(payload), dbCtx),
    );

    // Assert
    const movies = await select('movies', all).run(ctx.ownerPool);
    expect(movies).toHaveLength(2);
    expect(movies).toContainEqual(
      expect.objectContaining({
        id: movie2.id,
      }),
    );
    expect(movies).toContainEqual(
      expect.objectContaining({
        id: movie3.id,
      }),
    );
  });
});
