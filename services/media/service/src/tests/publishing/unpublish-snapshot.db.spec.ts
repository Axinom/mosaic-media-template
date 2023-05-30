import { Broker } from '@axinom/mosaic-message-bus';
import { toBeUuid } from '@axinom/mosaic-service-common';
import { stub } from 'jest-auto-stub';
import 'jest-extended';
import {
  MediaServiceMessagingSettings,
  UnpublishEntityCommand,
} from 'media-messages';
import { insert, select } from 'zapatos/db';
import * as tokenHelpers from '../../common/utils/token-utils';
import {
  createTestContext,
  createTestRequestContext,
  ITestContext,
  TestRequestContext,
} from '../test-utils';
import { UNPUBLISH_SNAPSHOT } from './gql-constants';

describe('Snapshot Unpublish endpoint', () => {
  let ctx: ITestContext;
  let snapshotId1: number;
  let defaultRequestContext: TestRequestContext;
  let messages: {
    messageType: string;
    message: UnpublishEntityCommand;
  }[] = [];

  beforeAll(async () => {
    const broker = stub<Broker>({
      publish: (messageType: string, message: UnpublishEntityCommand) => {
        messages.push({ messageType, message });
      },
    });
    ctx = await createTestContext({}, broker);
    defaultRequestContext = createTestRequestContext(ctx.config.serviceId);
    jest
      .spyOn(tokenHelpers, 'getLongLivedToken')
      .mockImplementation(async () => 'test-long-lived-token');
  });

  beforeEach(async () => {
    snapshotId1 = (
      await insert('snapshots', {
        entity_id: 1,
        publish_id: `movie-1`,
        job_id: '4f936eab-ed44-455d-ab22-fea3f50195ed',
        snapshot_no: 1,
        entity_type: 'MOVIE',
      }).run(ctx.ownerPool)
    ).id;
  });

  afterEach(async () => {
    await ctx.truncate('snapshots');
    messages = [];
  });

  afterAll(async () => {
    await ctx.dispose();
  });

  describe('unpublishSnapshots', () => {
    it('unpublish existing snapshot -> correct response received and message sent', async () => {
      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_SNAPSHOT,
        { snapshotId: snapshotId1 },
        defaultRequestContext,
      );

      // Assert
      expect(resp.errors).toBeFalsy();
      const snapshot = resp.data?.unpublishSnapshot;

      expect(snapshot).toMatchObject({
        id: snapshotId1,
        createdUser: 'Unknown',
        updatedUser: 'Unknown',
        entityId: 1,
        entityTitle: null,
        entityType: 'MOVIE',
        publishId: 'movie-1',
        publishedDate: null,
        scheduledDate: null,
        snapshotJson: null,
        snapshotNo: 1,
        snapshotState: 'INITIALIZATION',
        unpublishedDate: null,
        validationStatus: null,
      });
      toBeUuid(snapshot.jobId);
      expect(snapshot.id).toBeGreaterThan(0);

      expect(messages).toEqual([
        {
          message: {
            entity_id: snapshot.id,
            table_name: 'snapshots',
          },
          messageType:
            MediaServiceMessagingSettings.UnpublishEntity.messageType,
        },
      ]);

      const snapshots = await select('snapshots', {
        id: snapshotId1,
      }).run(ctx.ownerPool);
      expect(snapshots).toEqual([
        {
          created_date: snapshot.createdDate,
          created_user: snapshot.createdUser,
          entity_id: snapshot.entityId,
          entity_title: snapshot.entityTitle,
          entity_type: snapshot.entityType,
          id: snapshot.id,
          job_id: snapshot.jobId,
          publish_id: snapshot.publishId,
          published_date: snapshot.publishedDate,
          scheduled_date: snapshot.scheduledDate,
          snapshot_json: snapshot.snapshotJson,
          snapshot_no: snapshot.snapshotNo,
          snapshot_state: snapshot.snapshotState,
          unpublished_date: snapshot.unpublishedDate,
          updated_date: snapshot.updatedDate,
          updated_user: snapshot.updatedUser,
          validation_status: snapshot.validationStatus,
          is_list_snapshot: snapshot.isListSnapshot,
        },
      ]);
    });

    it('unpublish non-existing snapshot -> error thrown', async () => {
      // Arrange
      const invalidId = snapshotId1 + 10;

      // Act
      const resp = await ctx.runGqlQuery(
        UNPUBLISH_SNAPSHOT,
        { snapshotId: invalidId },
        defaultRequestContext,
      );

      // Assert
      expect(resp.data?.unpublishSnapshot).toBeFalsy();
      expect(resp.errors).toHaveLength(1);
      expect(resp.errors?.[0]).toMatchObject({
        code: 'SNAPSHOT_NOT_FOUND',
        details: undefined,
        message: `The snapshot with ID '${invalidId}' was not found.`,
        path: ['unpublishSnapshot'],
      });

      expect(messages).toEqual([]);

      const snapshots = await select('snapshots', {
        entity_id: invalidId,
      }).run(ctx.ownerPool);
      expect(snapshots).toEqual([]);
    });
  });
});
