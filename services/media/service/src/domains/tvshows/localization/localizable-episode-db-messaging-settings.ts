import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableEpisodeDbMessagingSettings
  implements MessagingSettings
{
  public static LocalizableEpisodeCreated =
    new LocalizableEpisodeDbMessagingSettings(
      'LocalizableEpisodeCreated',
      'inbox',
      'event',
      'episode',
    );
  public static LocalizableEpisodeUpdated =
    new LocalizableEpisodeDbMessagingSettings(
      'LocalizableEpisodeUpdated',
      'inbox',
      'event',
      'episode',
    );
  public static LocalizableEpisodeDeleted =
    new LocalizableEpisodeDbMessagingSettings(
      'LocalizableEpisodeDeleted',
      'inbox',
      'event',
      'episode',
    );
  public static LocalizableEpisodeImageCreated =
    new LocalizableEpisodeDbMessagingSettings(
      'LocalizableEpisodeImageCreated',
      'inbox',
      'event',
      'episode-image',
    );
  public static LocalizableEpisodeImageUpdated =
    new LocalizableEpisodeDbMessagingSettings(
      'LocalizableEpisodeImageUpdated',
      'inbox',
      'event',
      'episode-image',
    );
  public static LocalizableEpisodeImageDeleted =
    new LocalizableEpisodeDbMessagingSettings(
      'LocalizableEpisodeImageDeleted',
      'inbox',
      'event',
      'episode-image',
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
