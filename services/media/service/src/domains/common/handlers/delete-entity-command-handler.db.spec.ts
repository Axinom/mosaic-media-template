import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
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
import { DeleteEntityCommandHandler } from './delete-entity-command-handler';

describe('Start Ingest Item Handler', () => {
  let ctx: ITestContext;
  let handler: DeleteEntityCommandHandler;
  let movie1: movies.JSONSelectable;
  let movie2: movies.JSONSelectable;
  let movie3: movies.JSONSelectable;
  let message: MessageInfo<DeleteEntityCommand>;
  let messages: unknown[] = [];

  beforeAll(async () => {
    ctx = await createTestContext();
    const broker = stub<Broker>({
      publish: (_id: string, _settings: unknown, message: unknown) => {
        messages.push(message);
      },
    });
    const user = createTestUser(ctx.config.serviceId);
    message = stub<MessageInfo<DeleteEntityCommand>>({
      envelope: {
        auth_token:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
      },
    });
    handler = new DeleteEntityCommandHandler(broker, ctx.loginPool, ctx.config);

    jest
      .spyOn<any, string>(handler, 'getSubject')
      .mockImplementation(() => user);
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
    const content: DeleteEntityCommand = {
      table_name: tableName,
      entity_id: movie1.id,
      primary_key_name: 'id',
    };

    // Act
    await handler.onMessage(content, message);

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
