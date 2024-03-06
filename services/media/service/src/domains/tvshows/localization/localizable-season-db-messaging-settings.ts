import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableSeasonDbMessagingSettings implements MessagingSettings {
  public static LocalizableSeasonCreated =
    new LocalizableSeasonDbMessagingSettings(
      'LocalizableSeasonCreated',
      'inbox',
      'event',
      'season',
    );
  public static LocalizableSeasonUpdated =
    new LocalizableSeasonDbMessagingSettings(
      'LocalizableSeasonUpdated',
      'inbox',
      'event',
      'season',
    );
  public static LocalizableSeasonDeleted =
    new LocalizableSeasonDbMessagingSettings(
      'LocalizableSeasonDeleted',
      'inbox',
      'event',
      'season',
    );
  public static LocalizableSeasonImageCreated =
    new LocalizableSeasonDbMessagingSettings(
      'LocalizableSeasonImageCreated',
      'inbox',
      'event',
      'season-image',
    );
  public static LocalizableSeasonImageUpdated =
    new LocalizableSeasonDbMessagingSettings(
      'LocalizableSeasonImageUpdated',
      'inbox',
      'event',
      'season-image',
    );
  public static LocalizableSeasonImageDeleted =
    new LocalizableSeasonDbMessagingSettings(
      'LocalizableSeasonImageDeleted',
      'inbox',
      'event',
      'season-image',
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
