import { Nullable } from '@axinom/mosaic-ui';
import { MutationUpdateProgramArgs } from '../../../../generated/graphql';

export type ProgramDetailsFormData = Nullable<
  MutationUpdateProgramArgs['input']['patch']
>;
