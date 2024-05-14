import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { v4 as uuid } from 'uuid';
import { insert, select } from 'zapatos/db';
import {
  AD_CUE_POINT_SCHEDULE_TYPE,
  VIDEO_CUE_POINT_SCHEDULE_TYPE,
} from '../../common';
import {
  createTestContext,
  createTestRequestContext,
  createTestUser,
  TestContext,
  TestRequestContext,
} from '../test-utils';
import {
  UPDATE_AD_CUE_POINT_SCHEDULE,
  UPDATE_VIDEO_CUE_POINT_SCHEDULE,
} from './gql-constants';

describe('update cue point schedules', () => {
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
      await insert('playlists', {
        id: playlistId,
        start_date_time: new Date().toISOString(),
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

  describe('`AD_POD` cue point schedule update', () => {
    const cuePointScheduleId = uuid();
    beforeEach(async () => {
      await ctx.executeOwnerSql(user, async (dbContext) => {
        await insert('cue_point_schedules', {
          type: 'AD_POD',
          id: cuePointScheduleId,
          duration_in_seconds: 100,
          program_cue_point_id: programCuePointId,
          sort_index: 0,
        }).run(dbContext);
      });
    });

    it.each([0, -12345])(
      `schedule is not updated, if duration is %p`,
      async (adCuePointScheduleDuration) => {
        // Arrange
        const input = {
          sortIndex: 10,
          durationInSeconds: adCuePointScheduleDuration,
          id: cuePointScheduleId,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_AD_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        expect(
          resp.data?.updateAdCuePointSchedule?.cuePointSchedule,
        ).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message:
              'Cue point schedule duration cannot be less or equal to zero.',
            path: ['updateAdCuePointSchedule'],
          },
        ]);
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
      },
    );
    it.each([-1, -12345])(
      `schedule is not updated, if sort index is %p`,
      async (adCuePointScheduleIndex) => {
        // Arrange
        const input = {
          sortIndex: adCuePointScheduleIndex,
          durationInSeconds: 12,
          id: cuePointScheduleId,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_AD_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        // Assert
        expect(
          resp.data?.updateAdCuePointSchedule?.cuePointSchedule,
        ).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: 'Cue point schedule sort index cannot be less than zero.',
            path: ['updateAdCuePointSchedule'],
          },
        ]);
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
      },
    );

    it.each([1, 20, 150.12345, 0.00005])(
      `schedule duration(%p) and sort index is updated`,
      async (duration) => {
        // Arrange
        const input = {
          sortIndex: 10,
          durationInSeconds: duration,
          id: cuePointScheduleId,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_AD_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        expect(resp.errors).toBeFalsy();
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
        const savedSchedule = schedules[0];
        const returnedSchedule =
          resp.data?.updateAdCuePointSchedule?.cuePointSchedule;
        expect(returnedSchedule).toBeTruthy();
        expect(savedSchedule.program_cue_point_id).toBe(
          returnedSchedule!.programCuePointId,
        );
        expect(savedSchedule.sort_index).toBe(returnedSchedule!.sortIndex);
        expect(savedSchedule.duration_in_seconds).toBe(
          returnedSchedule!.durationInSeconds,
        );
        expect(savedSchedule.video_id).toBeNull();
        expect(savedSchedule.type).toBe(AD_CUE_POINT_SCHEDULE_TYPE);
      },
    );

    it(`schedule is not updated if referenced schedule id does not exists`, async () => {
      // Arrange
      const input = {
        sortIndex: 10,
        durationInSeconds: 600,
        id: uuid(), // random - none existent in db schedule id
      };
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE_AD_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(resp.errors).toBeFalsy();
      expect(resp.data?.updateAdCuePointSchedule?.cuePointSchedule).toBeFalsy();
    });

    it(`schedule is not updated, when attempting to update 'VIDEO' schedule through 'AD' mutation`, async () => {
      // Arrange
      const videoSchedule = await ctx.executeOwnerSql(user, async (txn) => {
        return insert('cue_point_schedules', {
          id: uuid(),
          type: 'VIDEO',
          video_id: uuid(),
          duration_in_seconds: 120,
          sort_index: 100,
          program_cue_point_id: programCuePointId,
        }).run(txn);
      });

      const input = {
        sortIndex: 10,
        durationInSeconds: 600,
        id: videoSchedule.id,
      };
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE_AD_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(resp.errors).toBeFalsy();
      expect(resp.data?.updateAdCuePointSchedule?.cuePointSchedule).toBeFalsy();
    });

    it(`schedule cue point parent reference is updated`, async () => {
      // Arrange
      const newCuePoint = await ctx.executeOwnerSql(user, async (txn) => {
        return insert('program_cue_points', {
          id: uuid(),
          program_id: programId,
          time_in_seconds: 33,
          video_cue_point_id: uuid(),
          type: 'MID',
        }).run(txn);
      });
      const input = {
        sortIndex: 10,
        durationInSeconds: 600,
        programCuePointId: newCuePoint.id,
        id: cuePointScheduleId,
      };
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE_AD_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(resp.errors).toBeFalsy();
      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(1);
      const savedSchedule = schedules[0];
      const returnedSchedule =
        resp.data?.updateAdCuePointSchedule?.cuePointSchedule;
      expect(returnedSchedule).toBeTruthy();
      expect(savedSchedule.program_cue_point_id).toBe(
        returnedSchedule!.programCuePointId,
      );
      expect(savedSchedule.sort_index).toBe(returnedSchedule!.sortIndex);
      expect(savedSchedule.duration_in_seconds).toBe(
        returnedSchedule!.durationInSeconds,
      );
      expect(savedSchedule.video_id).toBeNull();
      expect(savedSchedule.type).toBe(AD_CUE_POINT_SCHEDULE_TYPE);
    });
  });
  describe('`VIDEO` cue point schedule update', () => {
    const cuePointScheduleId = uuid();
    beforeEach(async () => {
      await ctx.executeOwnerSql(user, async (dbContext) => {
        await insert('cue_point_schedules', {
          type: 'VIDEO',
          id: cuePointScheduleId,
          duration_in_seconds: 100,
          program_cue_point_id: programCuePointId,
          sort_index: 0,
          video_id: uuid(),
        }).run(dbContext);
      });
    });

    it.each([-1, -12345])(
      `schedule is not updated, if sort index is %p`,
      async (videoCuePointScheduleIndex) => {
        // Arrange
        const input = {
          sortIndex: videoCuePointScheduleIndex,
          id: cuePointScheduleId,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_VIDEO_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        // Assert
        expect(
          resp.data?.updateVideoCuePointSchedule?.cuePointSchedule,
        ).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: 'Cue point schedule sort index cannot be less than zero.',
            path: ['updateVideoCuePointSchedule'],
          },
        ]);
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(1);
      },
    );

    it(`schedule is not updated if referenced schedule id does not exists`, async () => {
      // Arrange
      const input = {
        sortIndex: 10,
        id: uuid(), // random - none existent in db schedule id
      };
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE_VIDEO_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(resp.errors).toBeFalsy();
      expect(
        resp.data?.updateVideoCuePointSchedule?.cuePointSchedule,
      ).toBeFalsy();
    });

    it(`schedule is not updated, when attempting to update 'AD_POD' schedule through 'VIDEO' mutation`, async () => {
      // Arrange
      const adSchedule = await ctx.executeOwnerSql(user, async (txn) => {
        return insert('cue_point_schedules', {
          id: uuid(),
          type: 'AD_POD',
          duration_in_seconds: 120,
          sort_index: 100,
          program_cue_point_id: programCuePointId,
        }).run(txn);
      });

      const input = {
        sortIndex: 10,
        id: adSchedule.id,
      };
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE_VIDEO_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(resp.errors).toBeFalsy();
      expect(
        resp.data?.updateVideoCuePointSchedule?.cuePointSchedule,
      ).toBeFalsy();
    });

    it(`schedule sort index is updated`, async () => {
      // Arrange
      const input = {
        sortIndex: 10,
        id: cuePointScheduleId,
      };
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE_VIDEO_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(resp.errors).toBeFalsy();
      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(1);
      const savedSchedule = schedules[0];
      const returnedSchedule =
        resp.data?.updateVideoCuePointSchedule?.cuePointSchedule;
      expect(returnedSchedule).toBeTruthy();
      expect(savedSchedule.program_cue_point_id).toBe(
        returnedSchedule!.programCuePointId,
      );
      expect(savedSchedule.sort_index).toBe(returnedSchedule!.sortIndex);
      expect(savedSchedule.duration_in_seconds).toBe(
        returnedSchedule!.durationInSeconds,
      );
      expect(savedSchedule.video_id).not.toBeNull();
      expect(savedSchedule.type).toBe(VIDEO_CUE_POINT_SCHEDULE_TYPE);
    });

    it(`schedule cue point parent reference is updated`, async () => {
      // Arrange
      const newCuePoint = await ctx.executeOwnerSql(user, async (txn) => {
        return insert('program_cue_points', {
          id: uuid(),
          program_id: programId,
          time_in_seconds: 33,
          video_cue_point_id: uuid(),
          type: 'MID',
        }).run(txn);
      });
      const input = {
        programCuePointId: newCuePoint.id,
        id: cuePointScheduleId,
      };
      // Act
      const resp = await ctx.runGqlQuery(
        UPDATE_VIDEO_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(resp.errors).toBeFalsy();
      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(1);
      const savedSchedule = schedules[0];
      const returnedSchedule =
        resp.data?.updateVideoCuePointSchedule?.cuePointSchedule;
      expect(returnedSchedule).toBeTruthy();
      expect(savedSchedule.program_cue_point_id).toBe(
        returnedSchedule!.programCuePointId,
      );
      expect(savedSchedule.sort_index).toBe(returnedSchedule!.sortIndex);
      expect(savedSchedule.duration_in_seconds).toBe(
        returnedSchedule!.durationInSeconds,
      );
      expect(savedSchedule.video_id).not.toBeNull();
      expect(savedSchedule.type).toBe(VIDEO_CUE_POINT_SCHEDULE_TYPE);
    });
  });
});
