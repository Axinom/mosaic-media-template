import {
  Mutations as M,
  Queries as Q,
} from '../../generated/graphql/operations';

export const AdministrationReadOperations = [Q.language, Q.languages];

export const AdministrationMutateOperations = [
  M.createLanguage,
  M.deleteLanguage,
  M.updateLanguage,
];
