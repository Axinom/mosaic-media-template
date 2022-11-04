import { DEFAULT_SYSTEM_USERNAME } from '@axinom/mosaic-db-common';
import {
  AuthenticatedManagementSubject,
  SubjectType,
} from '@axinom/mosaic-id-guard';
import { PermissionKey } from '../../domains/permission-definition';

export const createTestUser = (
  serviceId: string,
  overrides?: Partial<AuthenticatedManagementSubject>,
): AuthenticatedManagementSubject => {
  // due to jest bug: https://github.com/kulshekhar/ts-jest/issues/281
  const subjectType: SubjectType =
    SubjectType !== undefined
      ? SubjectType.UserAccount
      : ('UserAccount' as SubjectType);

  const permission: PermissionKey = 'ADMIN';
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
        [serviceId]: [permission],
      },
      sub: '',
      tenantId: '27aa1b27-3441-4115-84aa-1ed5f3072248',
      environmentId: '83bfce33-61b1-4ec5-93d5-ad40e4ed33c9',
      subjectType,
    },
    ...overrides,
  };
};
