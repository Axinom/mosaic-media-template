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
  GeoIpRefreshFailed: {
    message: 'Failed to refresh GeoIP database:',
    code: 'GEOIP_DB_REFRESH_FAILED',
  },
  GeoIpDbDownloadFailed: {
    message: 'Failed to download GeoIP database:',
    code: 'GEOIP_DB_DOWNLOAD_FAILED',
  },
} as const;
