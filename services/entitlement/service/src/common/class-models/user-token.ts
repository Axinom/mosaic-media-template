import { Expose, Type } from 'class-transformer';

export class AuthToken {
  @Expose({ name: 'user_id' })
  userId?: string;

  @Expose({ name: 'profile_id' })
  profileId?: string;

  @Expose({ name: 'system' })
  system?: string;

  @Expose({ name: 'user_email' })
  userEmail?: string;

  @Expose({ name: 'user_mobile' })
  userMobile?: string;

  @Expose({ name: 'activation_date' })
  @Type(() => Date)
  activationDate?: Date;

  @Expose({ name: 'created_date' })
  @Type(() => Date)
  createdDate?: Date;

  @Expose({ name: 'registration_country' })
  registrationCountry?: string;
}

export interface TokenValidationResult {
  message: string;
  token?: AuthToken;
}
