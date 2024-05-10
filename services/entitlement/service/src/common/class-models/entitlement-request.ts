import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import 'reflect-metadata';
export enum RequestType {
  CHECK = 'check',
  DRM = 'drm',
}

export enum EntitlementRequestType {
  RECURLY = 'recurly',
}
export class EntitlementRequestModel {
  @IsString()
  device_id?: string;

  @IsString()
  device_name?: string;

  @IsNotEmpty()
  @IsString()
  asset_id: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => () => typeof EntitlementRequestType)
  entitlement_provider: EntitlementRequestType;

  @IsNotEmpty()
  @IsString()
  @Type(() => () => typeof RequestType)
  request_type: RequestType;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  key_id: string;

  @IsBoolean()
  persistent?: boolean;
}
