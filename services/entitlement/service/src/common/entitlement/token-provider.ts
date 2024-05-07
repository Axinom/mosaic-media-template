import { instanceToPlain } from 'class-transformer';
import jwt from 'jsonwebtoken';
import { MosaicDrmOptions } from './drm-options';
import {
  EntitlementMessage,
  EntitlementMessageDTO,
} from './entitlement-message-dto';

export class EntitlementTokenProvider {
  private readonly options: MosaicDrmOptions;

  constructor(options: MosaicDrmOptions) {
    this.options = options;
  }

  private mapEntitlementMessageWithDRMOptions(
    options: MosaicDrmOptions,
    persistent: boolean,
    downloadDuration?: number,
    contentKeyId?: string,
  ): EntitlementMessage {
    const playbackHours =
      persistent && downloadDuration && downloadDuration > 0
        ? downloadDuration * 24
        : options.drmMessageOptions.expirationHours;

    return new EntitlementMessage(
      persistent,
      downloadDuration || 0,
      new Date(Date.now() - 5000),
      new Date(Date.now() + playbackHours * 3600000),
      playbackHours * 3600,
      contentKeyId ? [{ Id: contentKeyId }] : undefined,
    );
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

    const message = this.mapEntitlementMessageWithDRMOptions(
      this.options,
      persistent,
      downloadDuration,
      contentKeyId,
    );

    const entitlementMessage: EntitlementMessageDTO = new EntitlementMessageDTO(
      1,
      new Date(),
      message.ExpirationDate,
      communicationKeyId,
      message,
    );

    const payload = instanceToPlain(entitlementMessage, {
      strategy: 'exposeAll',
      enableImplicitConversion: true,
    });
    const token = jwt.sign(payload, communicationKey, {
      algorithm: 'HS256',
      noTimestamp: true,
    });

    return token;
  }
}
