import { ContentOwner } from '../../../generated/graphql';

export type FormDataContentOwners = Pick<ContentOwner, 'name' | 'id'>;

export interface ContentOwnersFormData {
  contentOwners?: FormDataContentOwners[];
}
