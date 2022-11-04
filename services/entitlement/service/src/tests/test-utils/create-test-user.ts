import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import {
  AuthenticatedEndUser,
  AuthenticatedManagementSubject,
  SubjectType,
} from '@axinom/mosaic-id-guard';

export const createTestUser = (
  overrides?: Partial<AuthenticatedManagementSubject>,
): AuthenticatedManagementSubject => {
  return {
    name: DEFAULT_SYSTEM_USERNAME,
    tenantId: '27aa1b27-3441-4115-84aa-1ed5f3072248',
    environmentId: '83bfce33-61b1-4ec5-93d5-ad40e4ed33c9',
    email: 'usermail@gmail.com',
    subjectType: SubjectType.UserAccount,
    exp: new Date(Date.now() + 1000 * 60 * 60).getTime(), // 1 hour from now
    iat: Date.now(),
    aud: '*',
    iss: 'ax-id-service',
    sub: '00000000-0000-0000-0000-000000000000',
    permissions: {},
    ...overrides,
  };
};

export const createTestEndUser = (
  overrides?: Partial<AuthenticatedEndUser>,
): AuthenticatedEndUser => {
  return {
    ...{
      subjectType: SubjectType.EndUserAccount,
      aud: '*',
      exp: new Date(Date.now() + 1000 * 60 * 60).getTime(), // 1 hour from now
      iat: Date.now(),
      iss: 'ax-user-service',
      name: '**DEV** End-User',
      email: 'test@user.com',
      sessionId: 'fadf7cc2-f84c-42ac-8de1-7884b08873c9',
      profileId: '6da25e34-4f8f-4764-a846-48d132bade35',
      sub: 'dff22c55-1eea-4a1c-b401-e0ac1abb637a',
      applicationId: '72e99c92-d874-401e-981b-1588e681b9fe',
      tenantId: '13ee41ca-b530-4e00-9d51-352778c5f073',
      environmentId: 'bb55647b-0308-44ef-b28e-be3419d0ca08',
      extensions: {},
    },
    ...overrides,
  };
};
