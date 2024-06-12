import {
  createUpdateGQLFragmentGenerator,
  generateArrayMutationsWithUpdates,
} from '@axinom/mosaic-ui';
import {
  CreateProgramPayload,
  DeleteProgramPayload,
  Mutation,
  MutationCreateProgramArgs,
  MutationDeleteProgramArgs,
  MutationUpdateProgramArgs,
  Scalars,
  UpdateProgramPayload,
} from '../../../../generated/graphql';
import { ProgramProps } from '../ProgramManagement.types';

const generateUpdateGQLFragment = createUpdateGQLFragmentGenerator<Mutation>();

export const generateProgramMutations = (
  current: ProgramProps[],
  original: ProgramProps[],
  playlistId: Scalars['UUID'],
  deletedProgramIds: Scalars['UUID'][],
  deletedCuePointIds: Scalars['UUID'][],
): string[] => {
  return generateArrayMutationsWithUpdates({
    current,
    original,
    generateCreateMutation: ({
      sortIndex,
      title,
      videoId,
      videoDurationInSeconds,
      entityId,
      entityType,
      imageId,
    }) =>
      generateUpdateGQLFragment<
        MutationCreateProgramArgs,
        CreateProgramPayload
      >(
        'createProgram',
        {
          input: {
            program: {
              sortIndex,
              title,
              videoId,
              videoDurationInSeconds,
              entityId,
              entityType: { type: 'enum', value: entityType },
              playlistId,
              imageId,
            },
          },
        },
        [{ program: ['id', 'sortIndex'] }],
      ),
    generateUpdateMutation: ({ id, sortIndex }) =>
      generateUpdateGQLFragment<
        MutationUpdateProgramArgs,
        UpdateProgramPayload
      >(
        'updateProgram',
        {
          input: {
            id,
            patch: {
              sortIndex,
            },
          },
        },
        [{ program: ['id', 'sortIndex'] }],
      ),
    generateDeleteMutation: ({ id }) => {
      deletedProgramIds.push(id);
      for (const program of original) {
        if (program.id === id) {
          for (const cp of program?.programCuePoints.nodes ?? []) {
            deletedCuePointIds.push(cp.id);
          }
        }
      }

      return generateUpdateGQLFragment<
        MutationDeleteProgramArgs,
        DeleteProgramPayload
      >('deleteProgram', {
        input: {
          id,
        },
      });
    },
    prefix: 'programs',
    key: 'id',
  });
};
