import { Broker, MessageInfo } from '@axinom/mosaic-message-bus';
import {
  createOffsetDate,
  dateToBeInRange,
} from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import { UnpublishEntityCommand } from 'media-messages';
import { all, insert, select, update } from 'zapatos/db';
import { movies, snapshots } from 'zapatos/schema';
import { mockPublishingProcessor } from '../../tests/ingest/mock-publish-processor';
import {
  createTestContext,
  createTestUser,
  ITestContext,
} from '../../tests/test-utils';
import { createSnapshotWithRelation } from '../utils';
import { UnpublishEntityCommandHandler } from './unpublish-entity-command-handler';

describe('UnpublishEntityCommandHandler', () => {
  let ctx: ITestContext;
  let handler: UnpublishEntityCommandHandler;
  let message: MessageInfo<UnpublishEntityCommand>;
  let messages: unknown[] = [];
  let movie1: movies.JSONSelectable;
  let snapshot1: snapshots.JSONSelectable;
  let timestampBeforeTest: Date;

  beforeAll(async () => {
    ctx = await createTestContext();
    const broker = stub<Broker>({
      publish: (
        messageType: string,
        message: unknown,
        context: unknown,
        options: unknown,
      ) => {
        messages.push({ message, messageType, context, options });
      },
    });
    const user = createTestUser(ctx.config.serviceId);
    message = stub<MessageInfo<UnpublishEntityCommand>>({
      envelope: {
        auth_token:
          'some token value which is not used because we are substituting getPgSettings method and using a stub user',
      },
    });
    handler = new UnpublishEntityCommandHandler(
      [mockPublishingProcessor],
      broker,
      ctx.loginPool,
      ctx.config,
    );

    jest
      .spyOn<any, string>(handler, 'getSubject')
      .mockImplementation(() => user);
  });

  beforeEach(async () => {
    timestampBeforeTest = createOffsetDate(-20);
    movie1 = await insert('movies', {
      title: 'Entity1',
      external_id: 'existing1',
    }).run(ctx.ownerPool);
    snapshot1 = await createSnapshotWithRelation(
      'MOVIE',
      movie1.id,
      '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
      ctx.ownerPool,
    );
    await update(
      'snapshots',
      { snapshot_state: 'PUBLISHED' },
      { id: snapshot1.id },
    ).run(ctx.ownerPool);
  });

  afterEach(async () => {
    await ctx.truncate('movies');
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
    jest.restoreAllMocks();
  });

  describe('onMessage', () => {
    it('message to publish a movie -> snapshot with relation created with correct metadata and publish message sent', async () => {
      // Act
      await handler.onMessage(
        {
          table_name: mockPublishingProcessor.type,
          entity_id: movie1.id,
        },
        message,
      );

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: null,
          snapshot_no: 1,
          snapshot_state: 'UNPUBLISHED',
          validation_status: null,
        },
      ]);
      dateToBeInRange(
        snapshots[0].unpublished_date as string,
        timestampBeforeTest,
      );
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          context: {
            auth_token:
              'some token value which is not used because we are substituting getPgSettings method and using a stub user',
          },
          message: { content_id: `movie-${movie1.id}` },
          messageType: 'mock-unpublish',
          options: undefined,
        },
      ]);
    });

    it('message to publish a snapshot -> existing snapshot is updated with correct metadata and publish message sent', async () => {
      // Act
      await handler.onMessage(
        {
          table_name: 'snapshots',
          entity_id: snapshot1.id,
        },
        message,
      );

      // Assert
      const snapshots = await select('snapshots', all).run(ctx.ownerPool);
      const movieSnapshots = await select('movies_snapshots', all).run(
        ctx.ownerPool,
      );
      expect(snapshots).toMatchObject([
        {
          entity_id: movie1.id,
          entity_title: movie1.title,
          entity_type: 'MOVIE',
          job_id: '05b9d0f1-08db-43a8-87f3-7c771dc98a0e',
          publish_id: `movie-${movie1.id}`,
          snapshot_json: null,
          snapshot_no: 1,
          snapshot_state: 'UNPUBLISHED',
          validation_status: null,
        },
      ]);
      dateToBeInRange(
        snapshots[0].unpublished_date as string,
        timestampBeforeTest,
      );
      expect(movieSnapshots).toEqual([
        { snapshot_id: snapshots[0].id, movie_id: movie1.id },
      ]);
      expect(messages).toIncludeSameMembers([
        {
          context: {
            auth_token:
              'some token value which is not used because we are substituting getPgSettings method and using a stub user',
          },
          message: { content_id: `movie-${movie1.id}` },
          messageType: 'mock-unpublish',
          options: undefined,
        },
      ]);
    });
  });
});
