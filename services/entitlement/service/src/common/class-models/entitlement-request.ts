import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import 'reflect-metadata';
export enum RequestType {
  CHECK = 'check',
  DRM = 'drm',
}

export enum EntitlementRequestType {
  RECURLY = 'recurly',
}
export class EntitlementRequestModel {
  @IsOptional()
  @IsString()
  device_id?: string;

  @IsOptional()
  @IsString()
  device_name?: string;

  @IsNotEmpty({ message: 'Please specify a valid asset ID' })
  @IsString({ message: 'Please specify a valid asset ID' })
  asset_id: string;

  @IsNotEmpty({ message: 'Unknown entitlement provider: string' })
  @IsString({ message: 'Unknown entitlement provider: string' })
  @Type(() => () => typeof EntitlementRequestType)
  entitlement_provider: EntitlementRequestType;

  @IsNotEmpty({ message: 'Request type is required' })
  @IsString({ message: 'Request type is required' })
  @Type(() => () => typeof RequestType)
  request_type: RequestType;

  @IsNotEmpty({ message: 'Token is required' })
  @IsString({ message: 'Token is required' })
  token: string;

  @IsNotEmpty({ message: 'Please specify a valid key_id for the asset' })
  @IsString({ message: 'Please specify a valid key_id for the asset' })
  key_id: string;

  @IsOptional()
  @IsBoolean()
  persistent?: boolean;
}
