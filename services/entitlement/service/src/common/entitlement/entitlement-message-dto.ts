import { Expose, Transform } from 'class-transformer';

export class DRMKey {
  @Expose({ name: 'id' })
  Id: string;

  constructor(Id: string) {
    this.Id = Id;
  }
}

export class EntitlementMessage {
  @Expose({ name: 'persistent' })
  Persistent: boolean;

  @Expose({ name: 'license_download_duration', toPlainOnly: true })
  DownloadDuration: number | null;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  @Transform(({ value }) => new Date(value), { toPlainOnly: true })
  @Expose({ name: 'begin_date' })
  BeginDate: Date;

  @Transform(({ value }) => value.toISOString(), { toClassOnly: true })
  @Transform(({ value }) => new Date(value), { toPlainOnly: true })
  @Expose({ name: 'expiration_date' })
  ExpirationDate: Date;

  @Expose({ name: 'first_play_expiration' })
  FirstPlayExpiration: number;

  @Expose({ name: 'keys' })
  Keys?: DRMKey[];

  @Expose({ name: 'type' })
  readonly Type?: string = 'entitlement_message';

  constructor(
    Persistent: boolean,
    DownloadDuration: number,
    BeginDate: Date,
    ExpirationDate: Date,
    FirstPlayExpiration: number,
    Keys?: DRMKey[],
  ) {
    this.Persistent = Persistent;
    this.DownloadDuration = DownloadDuration;
    this.BeginDate = BeginDate;
    this.ExpirationDate = ExpirationDate;
    this.FirstPlayExpiration = FirstPlayExpiration;
    this.Keys = Keys;
  }
}

export class EntitlementMessageDTO {
  @Expose({ name: 'version' })
  Version = 1; // Default to 1, as a normal class property initialization

  // Default to 1, as a normal class property initialization
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  @Expose({ name: 'begin_date' })
  BeginDate: Date;

  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  @Expose({ name: 'expiration_date' })
  ExpirationDate: Date;

  @Expose({ name: 'com_key_id' })
  ComKeyId: string;

  @Expose({ name: 'message' })
  Message: EntitlementMessage;

  constructor(
    Version: number,
    BeginDate: Date,
    ExpirationDate: Date,
    ComKeyId: string,
    Message: EntitlementMessage,
  ) {
    this.Version = Version;
    this.BeginDate = BeginDate;
    this.ExpirationDate = ExpirationDate;
    this.ComKeyId = ComKeyId;
    this.Message = Message;
  }
}
