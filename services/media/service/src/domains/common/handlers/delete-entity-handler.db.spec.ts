import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';

import { DeleteEntityCommand } from 'media-messages';
import { all, insert, select } from 'zapatos/db';
import { movies } from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../../tests/test-utils';
import { DeleteEntityHandler } from './delete-entity-handler';

describe('Delete Entity Handler', () => {
  let ctx: ITestContext;
  let user: AuthenticatedManagementSubject;
  let handler: DeleteEntityHandler;
  let movie1: movies.JSONSelectable;
  let movie2: movies.JSONSelectable;
  let movie3: movies.JSONSelectable;
  let messages: unknown[] = [];

  const createMessage = (payload: DeleteEntityCommand) =>
    ({
      payload,
      metadata: { authToken: 'test-token' },
    }) satisfies Partial<
      Omit<TypedTransactionalMessage<DeleteEntityCommand>, 'metadata'>
    > & {
      metadata?: Partial<
        TypedTransactionalMessage<DeleteEntityCommand>['metadata']
      >;
    } as unknown as TypedTransactionalMessage<DeleteEntityCommand>;

  beforeAll(async () => {
    const storeOutboxMessage: StoreOutboxMessage = vi.fn(
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
    await ctx.executeOwnerSql(user, async (dbCtx) =>
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
