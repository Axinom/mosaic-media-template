import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';


class CustomerPermission {
  @IsString()
  id: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  object: string;
}

class GrantedBy {
  @IsString()
  object: string;

  @IsString()
  id: string;
}

class EntitlementData {
  @IsString()
  object: string;

  @ValidateNested()
  @Expose({ name: 'customer_permission' })
  @Type(() => CustomerPermission)
  customerPermission: CustomerPermission;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrantedBy)
  granted_by: GrantedBy[];

  @IsDate()
  @Expose({ name: 'created_at' })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  createdAt: Date;

  @IsDate()
  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  updatedAt: Date;
}

export class RecurlyEntitlement {
  @IsString()
  @Expose({ name: 'object' })
  object: string;

  @IsBoolean()
  @Expose({ name: 'has_more' })
  hasMore: boolean;

  @IsOptional()
  @Expose({ name: 'next' })
  next: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntitlementData)
  data: EntitlementData[];
}

export class RecurlyEntitlementError
{
    @IsString()
    @Expose({ name: 'type' })
    type: string;
    
    @IsString()
    @Expose({ name: 'message' })
    message: string;
}

export class RecurlyEntitlementErrorResponse
{
    @ValidateNested()
    @Expose({ name: 'error' })
    @Type(() => RecurlyEntitlementError)
    error: RecurlyEntitlementError;
}
