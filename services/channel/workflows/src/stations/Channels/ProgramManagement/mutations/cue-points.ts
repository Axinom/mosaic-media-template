import {
  createUpdateGQLFragmentGenerator,
  generateArrayMutationsWithUpdates,
} from '@axinom/mosaic-ui';
import {
  CreateProgramCuePointPayload,
  DeleteProgramCuePointPayload,
  Mutation,
  MutationCreateProgramCuePointArgs,
  MutationDeleteProgramCuePointArgs,
  MutationUpdateProgramCuePointArgs,
  UpdateProgramCuePointPayload,
} from '../../../../generated/graphql';
import { ProgramCuePointPayLoad } from '../ProgramManagement.types';

const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<Mutation>();

export const generateCuePointMutations = (
  current: ProgramCuePointPayLoad[],
  original: ProgramCuePointPayLoad[],
): string[] =>
  generateArrayMutationsWithUpdates({
    current,
    original,
    generateCreateMutation: ({
      value,
      timeInSeconds,
      type,
      programId,
      videoCuePointId,
    }) =>
      generateUpdateGQLFragment<
        MutationCreateProgramCuePointArgs,
        CreateProgramCuePointPayload
      >(
        'createProgramCuePoint',
        {
          input: {
            programCuePoint: {
              value,
              timeInSeconds,
              type: { type: 'enum', value: type },
              programId,
              videoCuePointId,
            },
          },
        },
        [
          {
            programCuePoint: [
              'id',
              'type',
              'timeInSeconds',
              { program: ['sortIndex'] },
            ],
          },
        ],
      ),
    generateUpdateMutation: ({
      id,
      value,
      timeInSeconds,
      type,
      programId,
      videoCuePointId,
    }) =>
      generateUpdateGQLFragment<
        MutationUpdateProgramCuePointArgs,
        UpdateProgramCuePointPayload
      >(
        'updateProgramCuePoint',
        {
          input: {
            id,
            patch: {
              value,
              timeInSeconds,
              type: { type: 'enum', value: type },
              programId,
              videoCuePointId,
            },
          },
        },
        [
          {
            programCuePoint: [
              'id',
              'type',
              'timeInSeconds',
              { program: ['sortIndex'] },
            ],
          },
        ],
      ),
    generateDeleteMutation: ({ id }) =>
      generateUpdateGQLFragment<
        MutationDeleteProgramCuePointArgs,
        DeleteProgramCuePointPayload
      >('deleteProgramCuePoint', {
        input: {
          id,
        },
      }),
    prefix: 'programCuePoints',
    key: 'id',
  });
