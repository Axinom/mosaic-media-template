import {
  Mutations as M,
  Queries as Q,
} from '../../generated/graphql/operations';

export const ContentOwnersReadOperations = [Q.contentOwners, Q.contentOwner];

export const ContentOwnersWriteOperations = [
  M.createContentOwner,
  M.updateContentOwner,
  M.deleteContentOwner,
];
