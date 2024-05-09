export enum AssetTypeEnum {
  Movie = 0,
  Episode = 1,
  Season = 2,
  Album = 3,
  ContentSet = 4,
  Track = 5,
  TvShow = 6,
  Collection = 8,
  Channel = 9,
  EpgProgram = 10,
  SubscriptionPlan = 11,
  Notification = 12,
  PromoCode = 13,
  LiveEvent = 14,
  File = 15,
  GenreList = 16,
  Unknown = 99,
  Custom = 100,
}

export class AssetTypeProvider {
  private static assetIdPattern = /^[A-Za-z0-9]+-(?<type>[0-9]+)-.+$/;

  static getAssetType(assetId: string): number {
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

    return type;
  }
}
