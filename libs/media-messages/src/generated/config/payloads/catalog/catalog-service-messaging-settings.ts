import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class CatalogServiceMessagingSettings implements MessagingSettings {
  /**
   * Defines the messaging settings for the event with message type 
   * "EntityPublishFailed" and aggregate type "entity".
   * The aggregate ID field contains the value of the "entity ID" field.
   */
  public static EntityPublishFailed = new CatalogServiceMessagingSettings(
    'EntityPublishFailed', 
    'inbox', 
    'entity.entity_publish_failed',
    'event',
    'entity'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "EntityPublishSuccess" and aggregate type "entity".
   * The aggregate ID field contains the value of the "entity ID" field.
   */
  public static EntityPublishSuccess = new CatalogServiceMessagingSettings(
    'EntityPublishSuccess', 
    'inbox', 
    'entity.entity_publish_success',
    'event',
    'entity'
    );
  
  public readonly serviceId = 'catalog-service';
  
  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly routingKey: string,
    public readonly action: 'command' | 'event',
    public readonly aggregateType: string,
  ) {
    
  }

  public toString = (): string => {
    return this.messageType;
  };
}