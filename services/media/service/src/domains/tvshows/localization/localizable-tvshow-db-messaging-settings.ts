import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableTvshowDbMessagingSettings implements MessagingSettings {
  public static LocalizableTvshowCreated =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowCreated',
      'inbox',
      '',
      'event',
      'tvshow',
    );
  public static LocalizableTvshowUpdated =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowUpdated',
      'inbox',
      '',
      'event',
      'tvshow',
    );
  public static LocalizableTvshowDeleted =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowDeleted',
      'inbox',
      '',
      'event',
      'tvshow',
    );
  public static LocalizableTvshowImageCreated =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowImageCreated',
      'inbox',
      '',
      'event',
      'tvshow-image',
    );
  public static LocalizableTvshowImageUpdated =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowImageUpdated',
      'inbox',
      '',
      'event',
      'tvshow-image',
    );
  public static LocalizableTvshowImageDeleted =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowImageDeleted',
      'inbox',
      '',
      'event',
      'tvshow-image',
    );
  public static LocalizableTvshowGenreCreated =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowGenreCreated',
      'inbox',
      '',
      'event',
      'tvshow-genre',
    );
  public static LocalizableTvshowGenreUpdated =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowGenreUpdated',
      'inbox',
      '',
      'event',
      'tvshow-genre',
    );
  public static LocalizableTvshowGenreDeleted =
    new LocalizableTvshowDbMessagingSettings(
      'LocalizableTvshowGenreDeleted',
      'inbox',
      '',
      'event',
      'tvshow-genre',
    );

  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly routingKey: string,
    public readonly action: 'command' | 'event',
    public readonly aggregateType: string,
  ) {}

  public toString = (): string => {
    return this.messageType;
  };
}
