export enum AssetType {
  Video = 1,
  Audio = 2,
  Image = 3,
  Document = 4,
  Unknown = 0,
}

export class AssetUtils {
  private static assetIdPattern = /^[A-Za-z0-9]+-(?<type>[0-9]+)-.+$/;

  private static convertToAssetType(typeNumber: number): AssetType {
    if (typeNumber in AssetType) {
      return typeNumber as AssetType;
    }
    return AssetType.Unknown;
  }

  static getAssetType(assetId: string): AssetType {
    if (!assetId) {
      return AssetType.Unknown;
    }

    const match = assetId.match(this.assetIdPattern);
    if (!match || !match.groups || !match.groups['type']) {
      return AssetType.Unknown;
    }

    const type = parseInt(match.groups['type']);
    if (isNaN(type)) {
      return AssetType.Unknown;
    }

    return this.convertToAssetType(type);
  }
}
