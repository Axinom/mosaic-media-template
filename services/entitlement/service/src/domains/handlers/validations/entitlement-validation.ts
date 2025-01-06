import moment from 'moment';
import {
  AssetModel,
  AuthenticatedTypes,
  EntitlementValidationResponse,
  FreeTypes,
  getFullConfig,
} from '../../../common';

const config = getFullConfig();

export const EntitlementValidation = (
  assetData: AssetModel,
  authenticated: boolean,
  country: string,
): EntitlementValidationResponse => {
  let downloadable = true;
  let entitled = false;
  let downloadDuration: number = Number.MAX_SAFE_INTEGER;

  if (assetData.licenses.nodes.length > 0) {
    const license = assetData.licenses.nodes.find((node) =>
      node.countries.some((c) => c.toUpperCase() === country.toUpperCase()),
    );

    if (!license) {
      return {
        isValid: false,
        message: 'Validation failed',
        error: {
          status: 400,
          message: `Validation error: Invalid country: ${country.toUpperCase()}`,
        },
        data: null,
      };
    }
    const utc = moment().utc().toDate();
    if (!(utc >= license.startTime && utc <= license.endTime)) {
      return {
        isValid: false,
        message: 'Validation failed',
        error: {
          status: 400,
          message: 'Validation error: License expired',
        },
        data: null,
      };
    }
    downloadable = downloadable && (license?.isDownloadable ?? false);
    downloadDuration = Math.min(
      downloadDuration,
      license?.downloadedAssetLifespan ?? 0,
    );

    entitled = authenticated
      ? FreeTypes.concat(AuthenticatedTypes).includes(assetData.businessType)
      : FreeTypes.includes(assetData.businessType);

    return {
      isValid: true,
      error: null,
      message: 'Validation successful',
      data: {
        assetId: assetData.id,
        assetType: assetData.assetType,
        keyId: '',
        Entitled: entitled,
        DownloadDuration: downloadDuration,
        IsDownloadable: downloadable,
      },
    };
  } else {
    return {
      isValid: false,
      error: { status: 400, message: 'Validation error: No licenses found' },
      message: 'No licenses found',
      data: {
        assetId: assetData.id,
        assetType: assetData.assetType,
        keyId: '',
        Entitled: entitled,
        DownloadDuration: downloadDuration,
        IsDownloadable: downloadable,
      },
    };
  }
};
