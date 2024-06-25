import { Nullable } from '@axinom/mosaic-ui';
import { MutationUpdatePlaylistArgs } from '../../../generated/graphql';

export type PlaylistDetailsFormData = Nullable<
  MutationUpdatePlaylistArgs['input']['patch']
>;
