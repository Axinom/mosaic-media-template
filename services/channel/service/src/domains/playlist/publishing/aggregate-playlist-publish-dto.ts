import { ProgramLocalization } from 'media-messages';
import { ClientBase } from 'pg';
import {
  ExtrasResult,
  LateralResult,
  parent,
  select,
  selectOne,
  sql,
  SQLFragment,
} from 'zapatos/db';
import {
  cue_point_schedules,
  playlists,
  programs,
  program_cue_points,
} from 'zapatos/schema';

export type ProgramPublishDto = programs.JSONSelectable &
  LateralResult<{
    program_cue_points: SQLFragment<
      (program_cue_points.JSONSelectable &
        LateralResult<{
          cue_point_schedules: SQLFragment<
            cue_point_schedules.JSONSelectable[],
            never
          >;
        }>)[],
      never
    >;
  }>;

export type PlaylistPublishDto = playlists.JSONSelectable &
  ExtrasResult<
    'playlists',
    { calculated_end_date_time: SQLFragment<string, never> }
  > &
  LateralResult<{
    programs: SQLFragment<ProgramPublishDto[], never>;
  }>;

export type LocalizedProgramPublishDto = ProgramPublishDto & {
  localizations: ProgramLocalization[];
};

export type LocalizedPlaylistPublishDto = playlists.JSONSelectable &
  ExtrasResult<
    'playlists',
    { calculated_end_date_time: SQLFragment<string, never> }
  > &
  LateralResult<{
    programs: SQLFragment<LocalizedProgramPublishDto[], never>;
  }>;

export const aggregatePlaylistPublishDto = async (
  id: string,
  gqlClient: ClientBase,
): Promise<PlaylistPublishDto | undefined> =>
  selectOne(
    'playlists',
    { id },
    {
      extras: {
        // Maybe possible to use the DB function `app_public.playlists_calculated_end_date_time`
        calculated_end_date_time: sql`${'start_date_time'} + ${'calculated_duration_in_seconds'} * interval '1 seconds'`,
      },
      lateral: {
        programs: select(
          'programs',
          {
            playlist_id: parent('id'),
          },
          {
            order: { by: 'sort_index', direction: 'ASC' },
            lateral: {
              program_cue_points: select(
                'program_cue_points',
                {
                  program_id: parent('id'),
                },
                {
                  order: {
                    by: 'time_in_seconds',
                    direction: 'ASC',
                    nulls: 'LAST',
                  },
                  lateral: {
                    cue_point_schedules: select(
                      'cue_point_schedules',
                      {
                        program_cue_point_id: parent('id'),
                      },
                      {
                        order: { by: 'sort_index', direction: 'ASC' },
                      },
                    ),
                  },
                },
              ),
            },
          },
        ),
      },
    },
  ).run(gqlClient);
