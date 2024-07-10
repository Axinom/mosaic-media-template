export const PublishValidationSeverity = ['WARNING', 'ERROR'] as const;
export type PublishValidationSeverityEnum =
  typeof PublishValidationSeverity[number];

export const PublishValidationContext = [
  'METADATA',
  'IMAGES',
  'VIDEOS',
  'LOCALIZATION',
] as const;

export type PublishValidationContextEnum =
  typeof PublishValidationContext[number];

export interface PublishValidationMessage {
  severity: PublishValidationSeverityEnum;
  context: PublishValidationContextEnum;
  message: string;
}

export const createValidationWarning = (
  message: string,
  context: PublishValidationContextEnum,
  postfix?: string,
): PublishValidationMessage => {
  return {
    severity: 'WARNING',
    context,
    message: postfix ? `${message} ${postfix}` : message,
  };
};

export const createValidationError = (
  message: string,
  context: PublishValidationContextEnum,
  postfix?: string,
): PublishValidationMessage => {
  return {
    severity: 'ERROR',
    context,
    message: postfix ? `${message} ${postfix}` : message,
  };
};
