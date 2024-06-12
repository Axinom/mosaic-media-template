import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableChannelDbMessagingSettings
  implements MessagingSettings
{
  public static LocalizableChannelCreated =
    new LocalizableChannelDbMessagingSettings(
      'LocalizableChannelCreated',
      'inbox',
      'event',
      'channel',
    );
  public static LocalizableChannelUpdated =
    new LocalizableChannelDbMessagingSettings(
      'LocalizableChannelUpdated',
      'inbox',
      'event',
      'channel',
    );
  public static LocalizableChannelDeleted =
    new LocalizableChannelDbMessagingSettings(
      'LocalizableChannelDeleted',
      'inbox',
      'event',
      'channel',
    );

  public static LocalizableChannelImageCreated =
    new LocalizableChannelDbMessagingSettings(
      'LocalizableChannelImageCreated',
      'inbox',
      'event',
      'channel-image',
    );
  public static LocalizableChannelImageUpdated =
    new LocalizableChannelDbMessagingSettings(
      'LocalizableChannelImageUpdated',
      'inbox',
      'event',
      'channel-image',
    );
  public static LocalizableChannelImageDeleted =
    new LocalizableChannelDbMessagingSettings(
      'LocalizableChannelImageDeleted',
      'inbox',
      'event',
      'channel-image',
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
