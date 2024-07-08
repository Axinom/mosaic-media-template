import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';

export enum BusinessType {
  Free = 'free',
  Advertisement = 'advertisement',
  Premium = 'premium',
  FreeDownloadable = 'free_downloadable',
  AdvertisementDownloadable = 'advertisement_downloadable',
  PremiumDownloadable = 'premium_downloadable',
  FreeAuthenticated = 'free_authenticated',
  AdvertisementAuthenticated = 'advertisement_authenticated',
}

export interface AssetHandlerInput {
  asset_id: string;
  key_id: string;
}
interface ErrorResponse {
  status: number;
  message: string;
}
export interface AssetValidationResponse {
  isValid: boolean;
  data?: AssetModel;
  error?: ErrorResponse;
}

export interface AssetHandlerResponse {
  isValid: boolean;
  data: AssetModel;
  error?: ErrorResponse;
}
export interface RecurlyEntitlementResponse {
  isValid: boolean;
  error?: ErrorResponse;
}

export interface EntitlementValidationResponse {
  isValid: boolean;
  error: ErrorResponse | null;
  message?: string;
  data: {
    assetId: string;
    assetType: number;
    keyId: string;
    Entitled: boolean;
    DownloadDuration: number;
    IsDownloadable: boolean;
  } | null;
}

class VideoNode {
  drmKeyId?: string;

  @IsBoolean()
  isProtected: boolean;

  @IsNotEmpty()
  type: string;
}

class Videos {
  @ValidateNested({ each: true })
  @Type(() => VideoNode)
  nodes: VideoNode[];
}

class LicenseNode {
  @IsBoolean()
  isDownloadable: boolean;

  @IsArray()
  @ArrayNotEmpty()
  countries: string[];

  // @IsNotEmpty()
  businessType: BusinessType;

  @IsNotEmpty()
  downloadedAssetLifespan: number;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;
}

class Licenses {
  @ValidateNested({ each: true })
  @Type(() => LicenseNode)
  nodes: LicenseNode[];
}

export class AssetModel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  assetType: number;

  @ValidateNested()
  @Type(() => Licenses)
  licenses: Licenses;

  @ValidateNested()
  @Type(() => Videos)
  videos: Videos;
}

export const FreeTypes: BusinessType[] = [
  BusinessType.Free,
  BusinessType.FreeDownloadable,
  BusinessType.Advertisement,
  BusinessType.AdvertisementDownloadable,
];

export const DownloadableTypes: BusinessType[] = [
  BusinessType.FreeDownloadable,
  BusinessType.AdvertisementDownloadable,
  BusinessType.PremiumDownloadable,
];

export const AuthenticatedTypes: BusinessType[] = [
  BusinessType.FreeAuthenticated,
  BusinessType.AdvertisementAuthenticated,
];
