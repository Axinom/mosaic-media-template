import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';

class VideoNode {
  drmKeyId?: string;

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

  @IsNotEmpty()
  downloadedAssetLifespan: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

class Licenses {
  @ValidateNested({ each: true })
  @Type(() => LicenseNode)
  nodes: LicenseNode[];
}

export class AssetModel {
  @ValidateNested()
  @Type(() => Videos)
  videos: Videos;

  @ValidateNested()
  @Type(() => Licenses)
  licenses: Licenses;
}
