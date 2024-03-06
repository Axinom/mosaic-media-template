import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableCollectionDbMessagingSettings
  implements MessagingSettings
{
  public static LocalizableCollectionCreated =
    new LocalizableCollectionDbMessagingSettings(
      'LocalizableCollectionCreated',
      'inbox',
      'event',
      'collection',
    );
  public static LocalizableCollectionUpdated =
    new LocalizableCollectionDbMessagingSettings(
      'LocalizableCollectionUpdated',
      'inbox',
      'event',
      'collection',
    );
  public static LocalizableCollectionDeleted =
    new LocalizableCollectionDbMessagingSettings(
      'LocalizableCollectionDeleted',
      'inbox',
      'event',
      'collection',
    );
  public static LocalizableCollectionImageCreated =
    new LocalizableCollectionDbMessagingSettings(
      'LocalizableCollectionImageCreated',
      'inbox',
      'event',
      'collection-image',
    );
  public static LocalizableCollectionImageUpdated =
    new LocalizableCollectionDbMessagingSettings(
      'LocalizableCollectionImageUpdated',
      'inbox',
      'event',
      'collection-image',
    );
  public static LocalizableCollectionImageDeleted =
    new LocalizableCollectionDbMessagingSettings(
      'LocalizableCollectionImageDeleted',
      'inbox',
      'event',
      'collection-image',
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
