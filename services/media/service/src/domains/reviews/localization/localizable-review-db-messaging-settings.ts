import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class LocalizableReviewDbMessagingSettings implements MessagingSettings {
  public static LocalizableReviewCreated =
    new LocalizableReviewDbMessagingSettings(
      'LocalizableReviewCreated',
      'inbox',
      'event',
      'review',
    );
  public static LocalizableReviewUpdated =
    new LocalizableReviewDbMessagingSettings(
      'LocalizableReviewUpdated',
      'inbox',
      'event',
      'review',
    );
  public static LocalizableReviewDeleted =
    new LocalizableReviewDbMessagingSettings(
      'LocalizableReviewDeleted',
      'inbox',
      'event',
      'review',
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
