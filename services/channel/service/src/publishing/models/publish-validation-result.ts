import { PublishValidationMessage } from './publish-validation-message';

export const PublishValidationStatus = ['OK', 'WARNINGS', 'ERRORS'] as const;
export type PublishValidationStatusEnum =
  typeof PublishValidationStatus[number];

export interface PublishValidationResult<TPayload> {
  publishPayload: TPayload;
  publishHash: string;
  validations: PublishValidationMessage[];
  validationStatus: PublishValidationStatusEnum;
}

export const calculateValidationStatus = (
  issues: PublishValidationMessage[],
): PublishValidationStatusEnum =>
  issues.reduce<PublishValidationStatusEnum>(
    (status, issue) =>
      issue.severity === 'ERROR' || status === 'ERRORS' ? 'ERRORS' : 'WARNINGS',
    'OK',
  );
