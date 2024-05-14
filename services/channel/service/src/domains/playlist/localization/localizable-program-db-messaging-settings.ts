import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableProgramDbMessagingSettings
  implements MessagingSettings
{
  public static LocalizableProgramCreated =
    new LocalizableProgramDbMessagingSettings(
      'LocalizableProgramCreated',
      'inbox',
      'event',
      'program',
    );
  public static LocalizableProgramUpdated =
    new LocalizableProgramDbMessagingSettings(
      'LocalizableProgramUpdated',
      'inbox',
      'event',
      'program',
    );
  public static LocalizableProgramDeleted =
    new LocalizableProgramDbMessagingSettings(
      'LocalizableProgramDeleted',
      'inbox',
      'event',
      'program',
    );

  public static LocalizableProgramImageCreated =
    new LocalizableProgramDbMessagingSettings(
      'LocalizableProgramImageCreated',
      'inbox',
      'event',
      'program-image',
    );
  public static LocalizableProgramImageUpdated =
    new LocalizableProgramDbMessagingSettings(
      'LocalizableProgramImageUpdated',
      'inbox',
      'event',
      'program-image',
    );
  public static LocalizableProgramImageDeleted =
    new LocalizableProgramDbMessagingSettings(
      'LocalizableProgramImageDeleted',
      'inbox',
      'event',
      'program-image',
    );

  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly action: 'command' | 'event',
    public readonly aggregateType: string,
  ) {}

  public readonly routingKey: string = '';
  public toString = (): string => {
    return this.messageType;
  };
}
