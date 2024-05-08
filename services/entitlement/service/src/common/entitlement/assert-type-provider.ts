export enum AssetTypeEnum {
  Video = 1,
  Audio = 2,
  Image = 3,
  Document = 4,
  Unknown = 0,
}

export class AssetTypeProvider {
  private static assetIdPattern = /^[A-Za-z0-9]+-(?<type>[0-9]+)-.+$/;

  private static convertToAssetType(typeNumber: number): AssetTypeEnum {
    if (typeNumber in AssetTypeEnum) {
      return typeNumber as AssetTypeEnum;
    }
    return AssetTypeEnum.Unknown;
  }

  static getAssetType(assetId: string): AssetTypeEnum {
    if (!assetId) {
      return AssetTypeEnum.Unknown;
    }

    const match = assetId.match(this.assetIdPattern);
    if (!match || !match.groups || !match.groups['type']) {
      return AssetTypeEnum.Unknown;
    }

    const type = parseInt(match.groups['type']);
    if (isNaN(type)) {
      return AssetTypeEnum.Unknown;
    }

    return this.convertToAssetType(type);
  }
}
