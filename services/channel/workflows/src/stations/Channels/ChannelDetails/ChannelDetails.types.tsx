import { Nullable } from '@axinom/mosaic-ui';
import { MutationUpdateChannelArgs } from '../../../generated/graphql';

export type ChannelDetailsFormData = Nullable<
  MutationUpdateChannelArgs['input']['patch']
>;
