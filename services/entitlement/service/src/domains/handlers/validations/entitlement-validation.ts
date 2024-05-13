import {
  AssetModel,
  AuthenticatedTypes,
  EntitlementValidationResponse,
  FreeTypes,
  getFullConfig,
} from '../../../common';

const config = getFullConfig();
const GeoBlockingFeatureSwitch = true;

export const EntitlementValidation = (
  assetData: AssetModel,
  authenticated: boolean,
  country: string,
): EntitlementValidationResponse => {
  let downloadable = true;
  let entitled = false;
  let downloadDuration: number = Number.MAX_SAFE_INTEGER;

  if (GeoBlockingFeatureSwitch && assetData.licenses.nodes.length > 0) {
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
    if (!(new Date() >= license.startTime && new Date() <= license.endTime)) {
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
      ? FreeTypes.concat(AuthenticatedTypes).includes(license.businessType)
      : FreeTypes.includes(license.businessType);
  }

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
};
