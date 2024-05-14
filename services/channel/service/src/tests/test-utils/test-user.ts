import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import {
  AuthenticatedManagementSubject,
  SubjectType,
} from '@axinom/mosaic-id-guard';

export const createTestUser = (
  serviceId: string,
  overrides?: Partial<AuthenticatedManagementSubject>,
  permissions: string[] = ['ADMIN'],
): AuthenticatedManagementSubject => {
  const iat = Date.now();
  const exp = new Date(Date.now() + 1000 * 60 * 60).getTime(); // 1 hour from now

  return {
    ...{
      aud: '',
      exp,
      iat,
      iss: '',
      name: DEFAULT_SYSTEM_USERNAME,
      permissions: {
        [serviceId]: permissions,
      },
      sub: '00000000-0000-0000-0000-000000000000',
      tenantId: '00000000-0000-0000-0000-000000000000',
      environmentId: '00000000-0000-0000-0000-000000000000',
      subjectType: SubjectType.UserAccount,
    },
    ...overrides,
  };
};
