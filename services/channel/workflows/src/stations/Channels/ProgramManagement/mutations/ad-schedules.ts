import {
  createUpdateGQLFragmentGenerator,
  generateArrayMutationsWithUpdates,
} from '@axinom/mosaic-ui';
import {
  CreateAdCuePointSchedulePayload,
  DeleteCuePointSchedulePayload,
  Mutation,
  MutationCreateAdCuePointScheduleArgs,
  MutationDeleteCuePointScheduleArgs,
  MutationUpdateAdCuePointScheduleArgs,
  UpdateAdCuePointSchedulePayload,
} from '../../../../generated/graphql';
import { CuePointSchedulePayLoad } from '../ProgramManagement.types';

const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<Mutation>();

export const generateAdSchedulesMutations = (
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
    }) =>
      generateUpdateGQLFragment<
        MutationCreateAdCuePointScheduleArgs,
        CreateAdCuePointSchedulePayload
      >(
        'createAdCuePointSchedule',
        {
          input: {
            sortIndex,
            durationInSeconds,
            programCuePointId,
          },
        },
        [{ cuePointSchedule: ['id'] }],
      ),
    generateUpdateMutation: ({
      sortIndex,
      id,
      programCuePointId,
      durationInSeconds,
    }) =>
      generateUpdateGQLFragment<
        MutationUpdateAdCuePointScheduleArgs,
        UpdateAdCuePointSchedulePayload
      >(
        'updateAdCuePointSchedule',
        {
          input: {
            id,
            programCuePointId,
            sortIndex,
            durationInSeconds,
          },
        },
        [{ cuePointSchedule: ['id'] }],
      ),
    generateDeleteMutation: ({ id }) =>
      generateUpdateGQLFragment<
        MutationDeleteCuePointScheduleArgs,
        DeleteCuePointSchedulePayload
      >('deleteCuePointSchedule', {
        input: {
          id,
        },
      }),
    prefix: 'adSchedule',
    key: 'id',
  });
