import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableMovieDbMessagingSettings implements MessagingSettings {
  public static LocalizableMovieCreated =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieCreated',
      'inbox',
      'event',
      'movie',
    );
  public static LocalizableMovieUpdated =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieUpdated',
      'inbox',
      'event',
      'movie',
    );
  public static LocalizableMovieDeleted =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieDeleted',
      'inbox',
      'event',
      'movie',
    );
  public static LocalizableMovieImageCreated =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieImageCreated',
      'inbox',
      'event',
      'movie-image',
    );
  public static LocalizableMovieImageUpdated =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieImageUpdated',
      'inbox',
      'event',
      'movie-image',
    );
  public static LocalizableMovieImageDeleted =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieImageDeleted',
      'inbox',
      'event',
      'movie-image',
    );
  public static LocalizableMovieGenreCreated =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieGenreCreated',
      'inbox',
      'event',
      'movie-genre',
    );
  public static LocalizableMovieGenreUpdated =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieGenreUpdated',
      'inbox',
      'event',
      'movie-genre',
    );
  public static LocalizableMovieGenreDeleted =
    new LocalizableMovieDbMessagingSettings(
      'LocalizableMovieGenreDeleted',
      'inbox',
      'event',
      'movie-genre',
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
