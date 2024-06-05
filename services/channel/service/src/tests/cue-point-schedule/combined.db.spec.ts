import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { v4 as uuid } from 'uuid';
import { CuePointScheduleTypeEnum } from 'zapatos/custom';
import { insert, select } from 'zapatos/db';
import { cue_point_schedules } from 'zapatos/schema';
import {
  createTestContext,
  createTestRequestContext,
  createTestUser,
  TestContext,
  TestRequestContext,
} from '../test-utils';
import {
  DeleteAndCreateAdCuePointScheduleOperationName,
  DeleteAndCreateVideoCuePointScheduleOperationName,
  DeleteAndUpdateAdCuePointScheduleOperationName,
  DeleteAndUpdateVideoCuePointScheduleOperationName,
  DELETE_AND_CREATE_AD_CUE_POINT_SCHEDULE,
  DELETE_AND_CREATE_VIDEO_CUE_POINT_SCHEDULE,
  DELETE_AND_UPDATE_AD_CUE_POINT_SCHEDULE,
  DELETE_AND_UPDATE_VIDEO_CUE_POINT_SCHEDULE,
} from './gql-constants';

describe('combined mutations', () => {
  let ctx: TestContext;
  let user: AuthenticatedManagementSubject;
  let defaultRequestContext: TestRequestContext;
  const channelId = uuid();
  const playlistId = uuid();
  const programId = uuid();
  const programCuePointId = uuid();

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId, {
      role: ctx.config.dbOwner,
    });
    defaultRequestContext = createTestRequestContext(
      ctx.config.serviceId,
      user,
    );
  });

  afterAll(async () => {
    await ctx.dispose();
  });
  beforeEach(async () => {
    await ctx.executeOwnerSql(user, async (dbContext) => {
      await insert('channels', {
        id: channelId,
        title: 'Best Test Channel+',
      }).run(dbContext);
      const startDate = new Date();
      await insert('playlists', {
        id: playlistId,
        title: startDate.toISOString().substring(0, 10),
        start_date_time: startDate,
        channel_id: channelId,
        calculated_duration_in_seconds: 133,
      }).run(dbContext);
      await insert('programs', {
        id: programId,
        playlist_id: playlistId,
        entity_id: uuid(),
        entity_type: 'MOVIE',
        video_duration_in_seconds: 100,
        video_id: uuid(),
        sort_index: 0,
        title: 'Mocks and how to use them',
      }).run(dbContext);
      await insert('program_cue_points', {
        time_in_seconds: 33,
        type: 'MID',
        program_id: programId,
        id: programCuePointId,
        video_cue_point_id: uuid(),
      }).run(dbContext);
    });
  });

  afterEach(async () => {
    await ctx.truncate('channels');
    await ctx.truncate('playlists');
    await ctx.truncate('programs');
    await ctx.truncate('program_cue_points');
    await ctx.truncate('cue_point_schedules');
  });
  describe('delete and create ad cue point schedule', () => {
    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is deleted and new ad schedule is created',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const createInput = {
          sortIndex: 1,
          programCuePointId: programCuePointId,
          durationInSeconds: 123.12345,
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_CREATE_AD_CUE_POINT_SCHEDULE,
          { createInput, deleteInput },
          defaultRequestContext,
          DeleteAndCreateAdCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toBeFalsy();
        const createdSchedule =
          resp.data?.createAdCuePointSchedule.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule.cuePointSchedule;
        expect(createdSchedule).not.toBeNull();
        expect(deletedSchedule).not.toBeNull();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
        const savedSchedule = schedules[0];
        expect(savedSchedule).toMatchObject({
          sort_index: createdSchedule.sortIndex,
          type: createdSchedule.type,
          id: createdSchedule.id,
          duration_in_seconds: createdSchedule.durationInSeconds,
        });
      },
    );

    it('if attempted to delete none existing schedule, the new schedule will not be created', async () => {
      // Arrange
      const createInput = {
        sortIndex: 1,
        programCuePointId: programCuePointId,
        durationInSeconds: 123.12345,
      };
      const deleteInput = {
        id: uuid(),
      };
      // Act
      const resp = await ctx.runGqlQuery(
        DELETE_AND_CREATE_AD_CUE_POINT_SCHEDULE,
        { createInput, deleteInput },
        defaultRequestContext,
        DeleteAndCreateAdCuePointScheduleOperationName,
      );
      // Assert
      expect(resp.errors).toMatchObject([
        {
          code: 'GRAPHQL_VALIDATION_FAILED',
          details: undefined,
          message:
            "No values were deleted in collection 'cue_point_schedules' because no values you can delete were found matching these criteria.",
          path: ['deleteCuePointSchedule'],
        },
      ]);
      const createdSchedule =
        resp.data?.createAdCuePointSchedule?.cuePointSchedule;
      const deletedSchedule =
        resp.data?.deleteCuePointSchedule?.cuePointSchedule;
      expect(createdSchedule).toBeTruthy();
      expect(deletedSchedule).toBeFalsy();

      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(0);
    });

    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is not deleted, if schedule creation fails',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const createInput = {
          sortIndex: 1,
          programCuePointId: programCuePointId,
          durationInSeconds: -123.12345,
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_CREATE_AD_CUE_POINT_SCHEDULE,
          { createInput, deleteInput },
          defaultRequestContext,
          DeleteAndCreateAdCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message:
              'Cue point schedule duration cannot be less or equal to zero.',
            path: ['createAdCuePointSchedule'],
          },
        ]);
        const createdSchedule =
          resp.data?.createAdCuePointSchedule?.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule?.cuePointSchedule;
        expect(createdSchedule).toBeFalsy();
        expect(deletedSchedule).toBeTruthy();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
        const dbSchedule = schedules[0];
        expect(dbSchedule).toMatchObject(scheduleToDelete);
      },
    );
  });

  describe('delete and create video cue point schedule', () => {
    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is deleted and new video schedule is created',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const createInput = {
          sortIndex: 1,
          programCuePointId: programCuePointId,
          durationInSeconds: 123.12345,
          videoId: uuid(),
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_CREATE_VIDEO_CUE_POINT_SCHEDULE,
          { createInput, deleteInput },
          defaultRequestContext,
          DeleteAndCreateVideoCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toBeFalsy();
        const createdSchedule =
          resp.data?.createVideoCuePointSchedule.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule.cuePointSchedule;
        expect(createdSchedule).not.toBeNull();
        expect(deletedSchedule).not.toBeNull();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
        const savedSchedule = schedules[0];
        expect(savedSchedule).toMatchObject({
          sort_index: createdSchedule.sortIndex,
          type: createdSchedule.type,
          id: createdSchedule.id,
          duration_in_seconds: createdSchedule.durationInSeconds,
        });
      },
    );

    it('if attempted to delete none existing schedule, the new schedule will not be created', async () => {
      // Arrange
      const createInput = {
        sortIndex: 1,
        programCuePointId: programCuePointId,
        durationInSeconds: 123.12345,
        videoId: uuid(),
      };
      const deleteInput = {
        id: uuid(),
      };
      // Act
      const resp = await ctx.runGqlQuery(
        DELETE_AND_CREATE_VIDEO_CUE_POINT_SCHEDULE,
        { createInput, deleteInput },
        defaultRequestContext,
        DeleteAndCreateVideoCuePointScheduleOperationName,
      );
      // Assert
      expect(resp.errors).toMatchObject([
        {
          code: 'GRAPHQL_VALIDATION_FAILED',
          details: undefined,
          message:
            "No values were deleted in collection 'cue_point_schedules' because no values you can delete were found matching these criteria.",
          path: ['deleteCuePointSchedule'],
        },
      ]);
      const createdSchedule =
        resp.data?.createVideoCuePointSchedule?.cuePointSchedule;
      const deletedSchedule =
        resp.data?.deleteCuePointSchedule?.cuePointSchedule;
      expect(createdSchedule).toBeTruthy();
      expect(deletedSchedule).toBeFalsy();

      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(0);
    });

    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is not deleted, if schedule creation fails',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const createInput = {
          sortIndex: 1,
          programCuePointId: programCuePointId,
          durationInSeconds: 123.12345,
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_CREATE_VIDEO_CUE_POINT_SCHEDULE,
          { createInput, deleteInput },
          defaultRequestContext,
          DeleteAndCreateVideoCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message:
              'The video id must be set for the cue point schedule with type "VIDEO".',
            path: ['createVideoCuePointSchedule'],
          },
        ]);
        const createdSchedule =
          resp.data?.createVideoCuePointSchedule?.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule?.cuePointSchedule;
        expect(createdSchedule).toBeFalsy();
        expect(deletedSchedule).toBeTruthy();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
        const dbSchedule = schedules[0];
        expect(dbSchedule).toMatchObject(scheduleToDelete);
      },
    );
  });

  describe('delete and update ad cue point schedule', () => {
    const updatableScheduleId = uuid();
    let updatableSchedule: cue_point_schedules.JSONSelectable;
    beforeEach(async () => {
      updatableSchedule = await ctx.executeOwnerSql(user, async (dbContext) => {
        return insert('cue_point_schedules', {
          id: updatableScheduleId,
          type: 'AD_POD',
          duration_in_seconds: 120,
          sort_index: 200,
          program_cue_point_id: programCuePointId,
        }).run(dbContext);
      });
    });
    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is deleted and ad schedule is updated',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const updateInput = {
          sortIndex: 13,
          durationInSeconds: 123.12345,
          id: updatableScheduleId,
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_UPDATE_AD_CUE_POINT_SCHEDULE,
          { updateInput, deleteInput },
          defaultRequestContext,
          DeleteAndUpdateAdCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toBeFalsy();
        const updatedSchedule =
          resp.data?.updateAdCuePointSchedule.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule.cuePointSchedule;
        expect(updatedSchedule).not.toBeNull();
        expect(deletedSchedule).not.toBeNull();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
        const savedSchedule = schedules[0];
        expect(savedSchedule).toMatchObject({
          sort_index: updatedSchedule.sortIndex,
          type: updatedSchedule.type,
          id: updatedSchedule.id,
          duration_in_seconds: updatedSchedule.durationInSeconds,
        });
      },
    );

    it('if attempted to delete none existing schedule, the schedule will not be updated', async () => {
      // Arrange
      const updateInput = {
        sortIndex: 13,
        durationInSeconds: 123.12345,
        id: updatableScheduleId,
      };
      const deleteInput = {
        id: uuid(),
      };
      // Act
      const resp = await ctx.runGqlQuery(
        DELETE_AND_UPDATE_AD_CUE_POINT_SCHEDULE,
        { updateInput, deleteInput },
        defaultRequestContext,
        DeleteAndUpdateAdCuePointScheduleOperationName,
      );
      // Assert
      expect(resp.errors).toMatchObject([
        {
          code: 'GRAPHQL_VALIDATION_FAILED',
          details: undefined,
          message:
            "No values were deleted in collection 'cue_point_schedules' because no values you can delete were found matching these criteria.",
          path: ['deleteCuePointSchedule'],
        },
      ]);
      const updatedSchedule =
        resp.data?.updateAdCuePointSchedule?.cuePointSchedule;
      const deletedSchedule =
        resp.data?.deleteCuePointSchedule?.cuePointSchedule;
      expect(updatedSchedule).toBeTruthy();
      expect(deletedSchedule).toBeFalsy();

      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(1);
      const dbSchedule = schedules[0];
      expect(dbSchedule).not.toMatchObject({
        sort_index: updateInput.sortIndex,
        duration_in_seconds: updateInput.durationInSeconds,
      });
    });

    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is not deleted, if schedule update fails',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const updateInput = {
          sortIndex: 13,
          durationInSeconds: -123.12345,
          id: updatableScheduleId,
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_UPDATE_AD_CUE_POINT_SCHEDULE,
          { updateInput, deleteInput },
          defaultRequestContext,
          DeleteAndUpdateAdCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message:
              'Cue point schedule duration cannot be less or equal to zero.',
            path: ['updateAdCuePointSchedule'],
          },
        ]);
        const updatedSchedule =
          resp.data?.updateVideoCuePointSchedule?.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule?.cuePointSchedule;
        expect(updatedSchedule).toBeFalsy();
        expect(deletedSchedule).toBeTruthy();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(2);
        const [dbUpdateSchedule] = schedules.filter(
          (s) => s.id === updatableScheduleId,
        );
        expect(dbUpdateSchedule).toMatchObject(updatableSchedule);
      },
    );
  });

  describe('delete and update video cue point schedule', () => {
    const updatableScheduleId = uuid();
    let updatableSchedule: cue_point_schedules.JSONSelectable;
    beforeEach(async () => {
      updatableSchedule = await ctx.executeOwnerSql(user, async (dbContext) => {
        return insert('cue_point_schedules', {
          id: updatableScheduleId,
          type: 'VIDEO',
          duration_in_seconds: 120,
          sort_index: 200,
          program_cue_point_id: programCuePointId,
          video_id: uuid(),
        }).run(dbContext);
      });
    });
    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is deleted and new video schedule is updated',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const updateInput = {
          sortIndex: 1,
          id: updatableScheduleId,
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_UPDATE_VIDEO_CUE_POINT_SCHEDULE,
          { updateInput, deleteInput },
          defaultRequestContext,
          DeleteAndUpdateVideoCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toBeFalsy();
        const updatedSchedule =
          resp.data?.updateVideoCuePointSchedule.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule.cuePointSchedule;
        expect(updatedSchedule).not.toBeNull();
        expect(deletedSchedule).not.toBeNull();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
        const savedSchedule = schedules[0];
        expect(savedSchedule).toMatchObject({
          sort_index: updatedSchedule.sortIndex,
          type: updatedSchedule.type,
          id: updatedSchedule.id,
          duration_in_seconds: updatedSchedule.durationInSeconds,
        });
      },
    );

    it('if attempted to delete none existing schedule, the schedule will not be updated', async () => {
      // Arrange
      const updateInput = {
        sortIndex: 1,
        id: updatableScheduleId,
      };
      const deleteInput = {
        id: uuid(),
      };
      // Act
      const resp = await ctx.runGqlQuery(
        DELETE_AND_UPDATE_VIDEO_CUE_POINT_SCHEDULE,
        { updateInput, deleteInput },
        defaultRequestContext,
        DeleteAndUpdateVideoCuePointScheduleOperationName,
      );
      // Assert
      expect(resp.errors).toMatchObject([
        {
          code: 'GRAPHQL_VALIDATION_FAILED',
          details: undefined,
          message:
            "No values were deleted in collection 'cue_point_schedules' because no values you can delete were found matching these criteria.",
          path: ['deleteCuePointSchedule'],
        },
      ]);
      const updatedSchedule =
        resp.data?.updateVideoCuePointSchedule?.cuePointSchedule;
      const deletedSchedule =
        resp.data?.deleteCuePointSchedule?.cuePointSchedule;
      expect(updatedSchedule).toBeTruthy();
      expect(deletedSchedule).toBeFalsy();

      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(1);
      expect(schedules).toMatchObject([updatableSchedule]);
    });

    it.each(['VIDEO', 'AD_POD'])(
      'schedule %p is not deleted, if schedule update fails',
      async (deletedScheduleType) => {
        // Arrange
        const scheduleToDelete = await ctx.executeOwnerSql(
          user,
          async (txn) => {
            return insert('cue_point_schedules', {
              id: uuid(),
              type: deletedScheduleType as CuePointScheduleTypeEnum,
              duration_in_seconds: 120,
              sort_index: 100,
              program_cue_point_id: programCuePointId,
              video_id: deletedScheduleType === 'VIDEO' ? uuid() : null,
            }).run(txn);
          },
        );
        const updateInput = {
          sortIndex: -1,
          id: updatableScheduleId,
        };
        const deleteInput = {
          id: scheduleToDelete.id,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          DELETE_AND_UPDATE_VIDEO_CUE_POINT_SCHEDULE,
          { updateInput, deleteInput },
          defaultRequestContext,
          DeleteAndUpdateVideoCuePointScheduleOperationName,
        );
        // Assert
        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: 'Cue point schedule sort index cannot be less than zero.',
            path: ['updateVideoCuePointSchedule'],
          },
        ]);
        const updatedSchedule =
          resp.data?.updateVideoCuePointSchedule?.cuePointSchedule;
        const deletedSchedule =
          resp.data?.deleteCuePointSchedule?.cuePointSchedule;
        expect(updatedSchedule).toBeFalsy();
        expect(deletedSchedule).toBeTruthy();

        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(2);
        const [dbUpdateSchedule] = schedules.filter(
          (s) => s.id === updatableScheduleId,
        );
        expect(dbUpdateSchedule).toMatchObject(updatableSchedule);
      },
    );
  });
});
