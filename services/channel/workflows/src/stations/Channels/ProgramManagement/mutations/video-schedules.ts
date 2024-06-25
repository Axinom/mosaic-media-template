import {
  createUpdateGQLFragmentGenerator,
  generateArrayMutationsWithUpdates,
} from '@axinom/mosaic-ui';
import {
  CreateVideoCuePointSchedulePayload,
  DeleteCuePointSchedulePayload,
  Mutation,
  MutationCreateVideoCuePointScheduleArgs,
  MutationDeleteCuePointScheduleArgs,
  MutationUpdateVideoCuePointScheduleArgs,
  UpdateVideoCuePointSchedulePayload,
} from '../../../../generated/graphql';
import { CuePointSchedulePayLoad } from '../ProgramManagement.types';

const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<Mutation>();

export const generateVideoSchedulesMutations = (
  current: CuePointSchedulePayLoad[],
  original: CuePointSchedulePayLoad[],
): string[] =>
  generateArrayMutationsWithUpdates({
    current,
    original,
    generateCreateMutation: ({
      sortIndex,
      durationInSeconds,
      programCuePointId,
      videoId,
    }) =>
      generateUpdateGQLFragment<
        MutationCreateVideoCuePointScheduleArgs,
        CreateVideoCuePointSchedulePayload
      >(
        'createVideoCuePointSchedule',
        {
          input: {
            sortIndex,
            durationInSeconds,
            programCuePointId,
            videoId,
          },
        },
        [{ cuePointSchedule: ['id'] }],
      ),
    generateUpdateMutation: ({ sortIndex, id, programCuePointId }) =>
      generateUpdateGQLFragment<
        MutationUpdateVideoCuePointScheduleArgs,
        UpdateVideoCuePointSchedulePayload
      >('updateVideoCuePointSchedule', {
        input: {
          id,
          programCuePointId,
          sortIndex,
        },
      }),
    generateDeleteMutation: ({ id }) =>
      generateUpdateGQLFragment<
        MutationDeleteCuePointScheduleArgs,
        DeleteCuePointSchedulePayload
      >('deleteCuePointSchedule', {
        input: {
          id,
        },
      }),
    prefix: 'videoSchedule',
    key: 'id',
  });
