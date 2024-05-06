import jwt from 'jsonwebtoken';
import { MosaicDrmOptions } from './drm-options';

interface Key {
  Id: string;
}

interface EntitlementMessage {
  Persistent: boolean;
  DownloadDuration: number | null;
  BeginDate: Date;
  ExpirationDate: Date;
  FirstPlayExpiration: number;
  Keys?: Key[];
}

interface EntitlementMessageDTO {
  Version: number;
  BeginDate: Date;
  ExpirationDate: Date;
  ComKeyId: string;
  Message: EntitlementMessage;
}

export class AxinomDrmTokenProvider {
  private readonly options: MosaicDrmOptions;

  constructor(options: MosaicDrmOptions) {
    this.options = options;
  }

  private mapDrmOptionsToEntitlementMessage(
    options: MosaicDrmOptions,
    persistent: boolean,
    downloadDuration?: number,
    contentKeyId?: string,
  ): EntitlementMessage {
    const playbackHours =
      persistent && downloadDuration && downloadDuration > 0
        ? downloadDuration * 24
        : options.drmMessageOptions.expirationHours;

    return {
      Persistent: persistent,
      DownloadDuration: downloadDuration || 0,
      BeginDate: new Date(Date.now() - 5000),
      ExpirationDate: new Date(Date.now() + playbackHours * 3600000),
      FirstPlayExpiration: playbackHours * 3600,
      Keys: contentKeyId ? [{ Id: contentKeyId }] : undefined,
    };
  }

  public getToken(
    persistent: boolean,
    downloadDuration?: number,
    contentKeyId?: string,
  ): string {
    const communicationKey = Buffer.from(
      this.options.mosaicDrmCommunicationKey,
      'base64',
    );
    const communicationKeyId = this.options.mosaicDrmCommunicationKeyId;

    const message = this.mapDrmOptionsToEntitlementMessage(
      this.options,
      persistent,
      downloadDuration,
      contentKeyId,
    );

    const entitlementMessage: EntitlementMessageDTO = {
      Version: 1,
      BeginDate: new Date(),
      ExpirationDate: message.ExpirationDate,
      ComKeyId: communicationKeyId,
      Message: message,
    };

    const token = jwt.sign(entitlementMessage, communicationKey, {
      algorithm: 'HS256',
      noTimestamp: true,
    });

    return token;
  }
}
