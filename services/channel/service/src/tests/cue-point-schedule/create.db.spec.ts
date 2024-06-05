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
  CREATE_AD_CUE_POINT_SCHEDULE,
  CREATE_VIDEO_CUE_POINT_SCHEDULE,
} from './gql-constants';

describe('create cue point schedules', () => {
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

  describe('`AD_POD` cue point schedule creation', () => {
    it.each([0, -12345])(
      `schedule is not created, if duration is %p`,
      async (adCuePointScheduleDuration) => {
        // Arrange
        const input = {
          sortIndex: 1,
          programCuePointId: programCuePointId,
          durationInSeconds: adCuePointScheduleDuration,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_AD_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        expect(
          resp.data?.createAdCuePointSchedule?.cuePointSchedule,
        ).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message:
              'Cue point schedule duration cannot be less or equal to zero.',
            path: ['createAdCuePointSchedule'],
          },
        ]);
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(0);
      },
    );

    it.each([-1, -12345])(
      `schedule is not created, if sort index is %p`,
      async (adCuePointScheduleIndex) => {
        // Arrange
        const input = {
          sortIndex: adCuePointScheduleIndex,
          programCuePointId: programCuePointId,
          durationInSeconds: 12,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_AD_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        expect(
          resp.data?.createAdCuePointSchedule?.cuePointSchedule,
        ).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: 'Cue point schedule sort index cannot be less than zero.',
            path: ['createAdCuePointSchedule'],
          },
        ]);
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(0);
      },
    );

    it.each([1, 20, 150.12345, 0.00005])(
      `schedule with duration %p is created`,
      async (durationInSeconds) => {
        // Arrange
        const input = {
          sortIndex: 0,
          programCuePointId,
          durationInSeconds: durationInSeconds,
        };
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_AD_CUE_POINT_SCHEDULE,
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
          resp.data?.createAdCuePointSchedule?.cuePointSchedule;
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
  });
  describe('`VIDEO` cue point schedule creation', () => {
    it.each([0, -12345])(
      `schedule is not created, if duration is %p`,
      async (videoCuePointScheduleDuration) => {
        // Arrange
        const input = {
          sortIndex: 1,
          programCuePointId: programCuePointId,
          durationInSeconds: videoCuePointScheduleDuration,
          videoId: uuid(),
        };
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_VIDEO_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        expect(
          resp.data?.createVideoCuePointSchedule?.cuePointSchedule,
        ).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message:
              'Cue point schedule duration cannot be less or equal to zero.',
            path: ['createVideoCuePointSchedule'],
          },
        ]);
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(0);
      },
    );

    it.each([-1, -12345])(
      `schedule is not created, if sort index is %p`,
      async (videoCuePointScheduleIndex) => {
        // Arrange
        const input = {
          sortIndex: videoCuePointScheduleIndex,
          programCuePointId: programCuePointId,
          durationInSeconds: 12,
          videoId: uuid(),
        };
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_VIDEO_CUE_POINT_SCHEDULE,
          { input },
          defaultRequestContext,
        );
        // Assert
        expect(
          resp.data?.createVideoCuePointSchedule?.cuePointSchedule,
        ).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: 'Cue point schedule sort index cannot be less than zero.',
            path: ['createVideoCuePointSchedule'],
          },
        ]);
        const schedules = await ctx.executeOwnerSql(user, async (txn) => {
          return select('cue_point_schedules', {}).run(txn);
        });
        expect(schedules).toHaveLength(0);
      },
    );

    it(`schedule is not created, if video id is not provided`, async () => {
      // Arrange
      const input = {
        sortIndex: 0,
        programCuePointId: programCuePointId,
        durationInSeconds: 12,
      };
      // Act
      const resp = await ctx.runGqlQuery(
        CREATE_VIDEO_CUE_POINT_SCHEDULE,
        { input },
        defaultRequestContext,
      );
      // Assert
      expect(
        resp.data?.createVideoCuePointSchedule?.cuePointSchedule,
      ).toBeFalsy();

      expect(resp.errors).toMatchObject([
        {
          code: 'DATABASE_VALIDATION_FAILED',
          details: undefined,
          message:
            'The video id must be set for the cue point schedule with type "VIDEO".',
          path: ['createVideoCuePointSchedule'],
        },
      ]);
      const schedules = await ctx.executeOwnerSql(user, async (txn) => {
        return select('cue_point_schedules', {}).run(txn);
      });
      expect(schedules).toHaveLength(0);
    });

    it.each([1, 20, 150.12345, 0.00005])(
      `schedule with duration %p is created`,
      async (durationInSeconds) => {
        // Arrange
        const input = {
          sortIndex: 0,
          programCuePointId,
          durationInSeconds: durationInSeconds,
          videoId: uuid(),
        };
        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_VIDEO_CUE_POINT_SCHEDULE,
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
          resp.data?.createVideoCuePointSchedule?.cuePointSchedule;
        expect(returnedSchedule).toBeTruthy();
        expect(savedSchedule.program_cue_point_id).toBe(
          returnedSchedule!.programCuePointId,
        );
        expect(savedSchedule.sort_index).toBe(returnedSchedule!.sortIndex);
        expect(savedSchedule.duration_in_seconds).toBe(
          returnedSchedule!.durationInSeconds,
        );
        expect(savedSchedule.video_id).toBe(returnedSchedule.videoId);
        expect(savedSchedule.type).toBe(VIDEO_CUE_POINT_SCHEDULE_TYPE);
      },
    );
  });
});
