import { AuthenticatedManagementSubject } from '@axinom/mosaic-id-guard';
import 'jest-extended';
import { v4 as uuid } from 'uuid';
import { CuePointScheduleTypeEnum } from 'zapatos/custom';
import { insert } from 'zapatos/db';
import {
  channels,
  cue_point_schedules,
  playlists,
  programs,
  program_cue_points,
} from 'zapatos/schema';
import {
  createTestContext,
  createTestUser,
  TestContext,
} from '../../../tests/test-utils';
import { aggregatePlaylistPublishDto } from './aggregate-playlist-publish-dto';

describe('create playlist publish dto', () => {
  let ctx: TestContext;
  let user: AuthenticatedManagementSubject;
  const testChannelId = uuid();

  const createChannel = async (): Promise<channels.JSONSelectable> => {
    return ctx.executeOwnerSql(user, async (ctx) =>
      insert('channels', {
        id: testChannelId,
        title: 'Test Channel',
        description: 'Channel for testing.',
      }).run(ctx),
    );
  };

  const createPlaylist = async (
    startDateTime: Date = new Date(),
    durationInSeconds?: number,
  ): Promise<playlists.JSONSelectable> => {
    return ctx.executeOwnerSql(user, async (ctx) =>
      insert('playlists', {
        id: uuid(),
        title: startDateTime.toISOString().substring(0, 10),
        start_date_time: startDateTime,
        calculated_duration_in_seconds: durationInSeconds ?? 10,
        channel_id: testChannelId,
      }).run(ctx),
    );
  };

  const createProgram = async (
    playlistId: string,
    sort_index: number,
  ): Promise<programs.JSONSelectable> => {
    return ctx.executeOwnerSql(user, async (ctx) =>
      insert('programs', {
        id: uuid(),
        playlist_id: playlistId,
        title: `Program ${sort_index}`,
        sort_index: sort_index,
        video_id: uuid(),
        video_duration_in_seconds: 10000,
        entity_id: uuid(),
        entity_type: 'MOVIE',
      }).run(ctx),
    );
  };

  const createCuePoints = async (
    programId: string,
  ): Promise<program_cue_points.JSONSelectable[]> => {
    return ctx.executeOwnerSql(user, async (ctx) =>
      insert('program_cue_points', [
        {
          id: uuid(),
          type: 'PRE',
          program_id: programId,
        },
        {
          id: uuid(),
          type: 'MID',
          time_in_seconds: 6940.23678,
          video_cue_point_id: uuid(),
          program_id: programId,
        },
        {
          id: uuid(),
          type: 'MID',
          time_in_seconds: 3025.12345,
          video_cue_point_id: uuid(),
          program_id: programId,
        },
        {
          id: uuid(),
          type: 'POST',
          program_id: programId,
        },
      ]).run(ctx),
    );
  };

  const createCuePointSchedule = (
    programCuePointId: string,
    index: number,
    type: CuePointScheduleTypeEnum,
    duration?: number,
  ): Promise<cue_point_schedules.JSONSelectable> => {
    return ctx.executeOwnerSql(user, async (ctx) =>
      insert('cue_point_schedules', {
        id: uuid(),
        type: type,
        video_id: type === 'VIDEO' ? uuid() : undefined,
        duration_in_seconds: duration ?? 10,
        program_cue_point_id: programCuePointId,
        sort_index: index,
      }).run(ctx),
    );
  };

  beforeAll(async () => {
    ctx = await createTestContext();
    user = createTestUser(ctx.config.serviceId, {
      role: ctx.config.dbOwner,
    });
    await createChannel();
  });

  afterEach(async () => {
    await ctx.truncate('cue_point_schedules');
    await ctx.truncate('program_cue_points');
    await ctx.truncate('programs');
    await ctx.truncate('playlists');
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.truncate('channels');
    await ctx.dispose();
  });

  it('publish dto is created', async () => {
    // Arrange
    const testPlaylist = await createPlaylist(new Date(), 12345.12345);

    // Act
    const dto = await ctx.executeOwnerSql(user, async (ctx) =>
      aggregatePlaylistPublishDto(testPlaylist.id, ctx),
    );

    // Assert
    expect(dto).toMatchObject({
      id: testPlaylist.id,
      programs: [],
      calculated_duration_in_seconds:
        testPlaylist.calculated_duration_in_seconds,
      start_date_time: testPlaylist.start_date_time,
    });
  });

  // durationInSeconds:
  // 1 minute
  // 30 minutes
  // 12 hours
  // 1 day
  // 3 days
  // 8 days
  it.each`
    startDateTime | durationInSeconds
    ${new Date()} | ${60}
    ${new Date()} | ${1800}
    ${new Date()} | ${43200}
    ${new Date()} | ${86400}
    ${new Date()} | ${259200}
    ${new Date()} | ${691200}
    ${new Date()} | ${259200.98765}
    ${new Date()} | ${691200.12345}
  `(
    'publish dto has correct calculated end date',
    async ({ startDateTime, durationInSeconds }) => {
      // Arrange
      const testPlaylist = await createPlaylist(
        startDateTime,
        durationInSeconds,
      );

      // Act
      const dto = await ctx.executeOwnerSql(user, async (ctx) =>
        aggregatePlaylistPublishDto(testPlaylist.id, ctx),
      );

      // Assert
      expect(dto).toMatchObject({
        id: testPlaylist.id,
        programs: [],
        calculated_duration_in_seconds:
          testPlaylist.calculated_duration_in_seconds,
        start_date_time: testPlaylist.start_date_time,
      });
      const expectedEndDateTime = new Date(
        startDateTime.getTime() + 1000 * durationInSeconds,
      );
      expect(new Date(dto!.calculated_end_date_time)).toEqual(
        expectedEndDateTime,
      );
    },
  );

  it('publish dto contains ordered programs', async () => {
    // Arrange
    const testPlaylist = await createPlaylist();
    const testPrograms = [
      await createProgram(testPlaylist.id, 92),
      await createProgram(testPlaylist.id, 3),
      await createProgram(testPlaylist.id, 47),
      await createProgram(testPlaylist.id, 0),
    ];

    // Act
    const dto = await ctx.executeOwnerSql(user, async (ctx) =>
      aggregatePlaylistPublishDto(testPlaylist.id, ctx),
    );

    // Assert
    expect(dto).toMatchObject({
      id: testPlaylist.id,
      calculated_duration_in_seconds:
        testPlaylist.calculated_duration_in_seconds,
      start_date_time: testPlaylist.start_date_time,
      programs: [
        // programs ordered by sort index
        ...testPrograms.sort((p1, p2) => p1.sort_index - p2.sort_index),
      ],
    });
  });

  it('publish dto program contains cue points', async () => {
    // Arrange
    const testPlaylist = await createPlaylist();
    const testProgram = await createProgram(testPlaylist.id, 0);
    await createCuePoints(testProgram.id);

    // Act
    const dto = await ctx.executeOwnerSql(user, async (ctx) =>
      aggregatePlaylistPublishDto(testPlaylist.id, ctx),
    );

    // Assert
    expect(dto).toMatchObject({
      id: testPlaylist.id,
      calculated_duration_in_seconds:
        testPlaylist.calculated_duration_in_seconds,
      start_date_time: testPlaylist.start_date_time,
      programs: [
        {
          id: testProgram.id,
          title: testProgram.title,
        },
      ],
    });

    expect(dto?.programs[0].program_cue_points).toHaveLength(4);
  });

  it('publish dto contains ordered cue point schedules', async () => {
    // Arrange
    const testPlaylist = await createPlaylist();
    const testProgram = await createProgram(testPlaylist.id, 0);
    const testCuePoints = await createCuePoints(testProgram.id);
    const testCuePoint = testCuePoints[0];
    const testSchedules = [
      await createCuePointSchedule(testCuePoint.id, 86, 'AD_POD'),
      await createCuePointSchedule(testCuePoint.id, 0, 'AD_POD'),
      await createCuePointSchedule(testCuePoint.id, 34, 'AD_POD'),
      await createCuePointSchedule(testCuePoint.id, 9, 'AD_POD'),
    ];

    // Act
    const dto = await ctx.executeOwnerSql(user, async (ctx) =>
      aggregatePlaylistPublishDto(testPlaylist.id, ctx),
    );

    // Assert
    expect(dto).toMatchObject({
      id: testPlaylist.id,
      calculated_duration_in_seconds:
        testPlaylist.calculated_duration_in_seconds,
      start_date_time: testPlaylist.start_date_time,
      programs: [
        {
          id: testProgram.id,
          title: testProgram.title,
        },
      ],
    });

    const programCuePoint = dto!.programs![0].program_cue_points.filter(
      function (cp) {
        return cp.id === testCuePoint.id;
      },
    )[0];
    expect(programCuePoint).toMatchObject({
      cue_point_schedules: [
        ...testSchedules.sort((s1, s2) => s1.sort_index - s2.sort_index),
      ],
    });
  });
});
