export const CommonErrors = {
  LicenseNotFound: {
    message: 'The %s does not have a license.',
    code: 'LICENSE_NOT_FOUND',
  },
  LicenseIsNotValid: {
    message:
      'The %s does not have a valid license in your current country (%s)',
    code: 'LICENSE_IS_NOT_VALID',
  },
} as const;
