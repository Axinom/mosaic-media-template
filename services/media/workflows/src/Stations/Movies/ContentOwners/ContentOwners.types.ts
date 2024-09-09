import { ContentOwner } from '../../../generated/graphql';

export type FormDataContentOwners = Pick<
  ContentOwner,
  'name' | 'sortOrder' | 'id'
>;

export interface ContentOwnersFormData {
  contentOwners?: FormDataContentOwners[];
}
