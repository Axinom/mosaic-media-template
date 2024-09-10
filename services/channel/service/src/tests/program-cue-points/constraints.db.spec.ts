import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import { v4 as uuid } from 'uuid';
import { ProgramBreakTypeEnum } from 'zapatos/custom';
import { insert } from 'zapatos/db';
import {
  createTestContext,
  createTestRequestContext,
  createTestUser,
  TestContext,
  TestRequestContext,
} from '../test-utils';
import {
  CREATE_PROGRAM_CUE_POINT,
  UPDATE_PROGRAM_CUE_POINT,
} from './gql-constants';

describe('Program Cue points business constraints', () => {
  let ctx: TestContext;
  let user: AuthenticatedManagementSubject;
  let defaultRequestContext: TestRequestContext;
  const channelId = uuid();
  const playlistId = uuid();
  const programId = uuid();

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
        calculated_duration_in_seconds: 100,
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
    });
  });

  afterEach(async () => {
    await ctx.truncate('channels');
    await ctx.truncate('playlists');
    await ctx.truncate('programs');
    await ctx.truncate('program_cue_points');
  });

  describe('ON CREATE', () => {
    it.each(['PRE', 'POST'])(
      'attempt to create cue point with type %p when it already exists -> error is thrown',
      async (type) => {
        // Arrange
        await ctx.executeOwnerSql(user, async (dbContext) => {
          await insert('program_cue_points', {
            program_id: programId,
            type: type as ProgramBreakTypeEnum,
          }).run(dbContext);
        });

        const programCuePoint = {
          programId: programId,
          type: type as ProgramBreakTypeEnum,
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'UNIQUE_CONSTRAINT_ERROR',
            details: undefined,
            message:
              'Attempt to create or update an element failed, as it would have resulted in a duplicate element.',
            path: ['createProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['MID'])(
      'Program can have multiple %p program cue points defined',
      async (type) => {
        // Arrange
        await ctx.executeOwnerSql(user, async (dbContext) => {
          await insert('program_cue_points', {
            program_id: programId,
            type: type as ProgramBreakTypeEnum,
            time_in_seconds: 10,
            video_cue_point_id: uuid(),
          }).run(dbContext);
        });

        const programCuePoint = {
          programId: programId,
          type: type as ProgramBreakTypeEnum,
          timeInSeconds: 10,
          videoCuePointId: uuid(),
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toMatchObject(
          programCuePoint,
        );

        expect(resp.errors).toBeFalsy();
      },
    );

    it.each(['PRE', 'POST'])(
      'if %p program cue points has time defined -> error is thrown',
      async (type) => {
        // Arrange
        const programCuePoint = {
          programId: programId,
          type: type as ProgramBreakTypeEnum,
          timeInSeconds: 10,
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The time must not be set for the program cue point with type "${type}".`,
            path: ['createProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['PRE', 'POST'])(
      'if %p program cue points has video cue point id defined -> error is thrown',
      async (type) => {
        // Arrange
        const programCuePoint = {
          programId: programId,
          type: type as ProgramBreakTypeEnum,
          videoCuePointId: uuid(),
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The video cue point id must not be set for the program cue point with type "${type}".`,
            path: ['createProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['MID'])(
      'if %p program cue points has video cue point id not defined -> error is thrown',
      async (type) => {
        // Arrange
        const programCuePoint = {
          programId: programId,
          type: type as ProgramBreakTypeEnum,
          timeInSeconds: 10,
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The video cue point id must be set for the program cue point with type "${type}".`,
            path: ['createProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['MID'])(
      'if %p program cue points has time in seconds not defined -> error is thrown',
      async (type) => {
        // Arrange
        const programCuePoint = {
          programId: programId,
          type: type as ProgramBreakTypeEnum,
          videoCuePointId: uuid(),
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The time must be set for the program cue point with type "${type}".`,
            path: ['createProgramCuePoint'],
          },
        ]);
      },
    );

    it.each([0, 27.12343, 74.54321, 100])(
      'MID program cue points is created, if time is set within the program duration: %p',
      async (timeInSeconds) => {
        // Arrange
        const programCuePoint = {
          programId: programId,
          type: 'MID',
          videoCuePointId: uuid(),
          timeInSeconds: timeInSeconds,
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toMatchObject(
          programCuePoint,
        );

        expect(resp.errors).toBeFalsy();
      },
    );

    it.each([100.00001, 100.12334, 150.12345, 200])(
      'if MID program cue point time is bigger(%p) than program duration -> error is thrown',
      async (timeInSeconds) => {
        // Arrange
        const programCuePoint = {
          programId: programId,
          type: 'MID',
          videoCuePointId: uuid(),
          timeInSeconds: timeInSeconds,
        };

        // Act
        const resp = await ctx.runGqlQuery(
          CREATE_PROGRAM_CUE_POINT,
          { input: { programCuePoint } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The program cue point time must be within the duration of the program.`,
            path: ['createProgramCuePoint'],
          },
        ]);
      },
    );
  });

  describe('ON UPDATE', () => {
    it.each(['PRE', 'POST'])(
      'if attempt to update "MID" cue point to have type %p, when it already exists-> error is thrown',
      async (type) => {
        // Arrange
        const midCuePoint = await ctx.executeOwnerSql(
          user,
          async (dbContext) => {
            await insert('program_cue_points', {
              program_id: programId,
              type: type as ProgramBreakTypeEnum,
            }).run(dbContext);
            return insert('program_cue_points', {
              program_id: programId,
              type: 'MID',
              time_in_seconds: 10,
              video_cue_point_id: uuid(),
            }).run(dbContext);
          },
        );

        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_PROGRAM_CUE_POINT,
          {
            input: {
              id: midCuePoint.id,
              patch: {
                type: type as ProgramBreakTypeEnum,
                videoCuePointId: null,
                timeInSeconds: null,
              },
            },
          },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'UNIQUE_CONSTRAINT_ERROR',
            details: undefined,
            message:
              'Attempt to create or update an element failed, as it would have resulted in a duplicate element.',
            path: ['updateProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['PRE', 'POST'])(
      'if attempt to update %p program cue points to have time defined -> error is thrown',
      async (type) => {
        // Arrange
        const cuePoint = await ctx.executeOwnerSql(user, async (dbContext) => {
          return insert('program_cue_points', {
            program_id: programId,
            type: type as ProgramBreakTypeEnum,
          }).run(dbContext);
        });
        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_PROGRAM_CUE_POINT,
          { input: { id: cuePoint.id, patch: { timeInSeconds: 10 } } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The time must not be set for the program cue point with type "${type}".`,
            path: ['updateProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['PRE', 'POST'])(
      'if attempt to update %p program cue points to have video cue point id defined -> error is thrown',
      async (type) => {
        // Arrange
        const cuePoint = await ctx.executeOwnerSql(user, async (dbContext) => {
          return insert('program_cue_points', {
            program_id: programId,
            type: type as ProgramBreakTypeEnum,
          }).run(dbContext);
        });
        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_PROGRAM_CUE_POINT,
          { input: { id: cuePoint.id, patch: { videoCuePointId: uuid() } } },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The video cue point id must not be set for the program cue point with type "${type}".`,
            path: ['updateProgramCuePoint'],
          },
        ]);
      },
    );

    it.each([100.00001, 100.12334, 150.12345, 200])(
      'if attempt to update "MID" program cue point to have time bigger(%p) than program duration -> error is thrown',
      async (timeInSeconds) => {
        // Arrange
        const cuePoint = await ctx.executeOwnerSql(user, async (dbContext) => {
          return insert('program_cue_points', {
            program_id: programId,
            type: 'MID',
            time_in_seconds: 10,
            video_cue_point_id: uuid(),
          }).run(dbContext);
        });

        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_PROGRAM_CUE_POINT,
          {
            input: { id: cuePoint.id, patch: { timeInSeconds: timeInSeconds } },
          },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The program cue point time must be within the duration of the program.`,
            path: ['updateProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['MID'])(
      'if attempt to update %p program cue points to have video cue point id not defined -> error is thrown',
      async (type) => {
        // Arrange
        const cuePoint = await ctx.executeOwnerSql(user, async (dbContext) => {
          return insert('program_cue_points', {
            program_id: programId,
            type: 'MID',
            time_in_seconds: 10,
            video_cue_point_id: uuid(),
          }).run(dbContext);
        });

        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_PROGRAM_CUE_POINT,
          {
            input: { id: cuePoint.id, patch: { videoCuePointId: null } },
          },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The video cue point id must be set for the program cue point with type "${type}".`,
            path: ['updateProgramCuePoint'],
          },
        ]);
      },
    );

    it.each(['MID'])(
      'if attempt to update %p program cue points to have time in seconds not defined -> error is thrown',
      async (type) => {
        // Arrange
        const cuePoint = await ctx.executeOwnerSql(user, async (dbContext) => {
          return insert('program_cue_points', {
            program_id: programId,
            type: 'MID',
            time_in_seconds: 10,
            video_cue_point_id: uuid(),
          }).run(dbContext);
        });

        // Act
        const resp = await ctx.runGqlQuery(
          UPDATE_PROGRAM_CUE_POINT,
          {
            input: { id: cuePoint.id, patch: { timeInSeconds: null } },
          },
          defaultRequestContext,
        );

        // Assert
        expect(resp.data?.createProgramCuePoint?.programCuePoint).toBeFalsy();

        expect(resp.errors).toMatchObject([
          {
            code: 'DATABASE_VALIDATION_FAILED',
            details: undefined,
            message: `The time must be set for the program cue point with type "${type}".`,
            path: ['updateProgramCuePoint'],
          },
        ]);
      },
    );
  });
});
