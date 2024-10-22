import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class MediaServiceMessagingSettings implements MessagingSettings {
  /**
   * Defines the messaging settings for the command with message type 
   * "DeleteEntity" and aggregate type "entity".
   * The aggregate ID field must contain the value of the "entity ID" field.
   */
  public static DeleteEntity = new MediaServiceMessagingSettings(
    'DeleteEntity', 
    'inbox', 
    'entity.delete',
    'command',
    'entity'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "PublishEntity" and aggregate type "entity".
   * The aggregate ID field must contain the value of the "snapshot ID" field.
   */
  public static PublishEntity = new MediaServiceMessagingSettings(
    'PublishEntity', 
    'inbox', 
    'entity.publish_entity',
    'command',
    'entity'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "UnpublishEntity" and aggregate type "entity".
   * The aggregate ID field must contain the value of the "entity ID" field.
   */
  public static UnpublishEntity = new MediaServiceMessagingSettings(
    'UnpublishEntity', 
    'inbox', 
    'entity.unpublish_entity',
    'command',
    'entity'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "StartIngest" and aggregate type "ingest-document".
   * The aggregate ID field must contain the value of the "ingest document ID" field.
   */
  public static StartIngest = new MediaServiceMessagingSettings(
    'StartIngest', 
    'inbox', 
    'ingest.start',
    'command',
    'ingest-document'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "StartIngestItem" and aggregate type "ingest-item".
   * The aggregate ID field must contain the value of the "ingest item ID" field.
   */
  public static StartIngestItem = new MediaServiceMessagingSettings(
    'StartIngestItem', 
    'inbox', 
    'ingest.start_item',
    'command',
    'ingest-item'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "UpdateMetadata" and aggregate type "ingest-item".
   * The aggregate ID field must contain the value of the "entity ID" field.
   */
  public static UpdateMetadata = new MediaServiceMessagingSettings(
    'UpdateMetadata', 
    'inbox', 
    'ingest.update_metadata',
    'command',
    'ingest-item'
    );
  /**
   * Defines the messaging settings for the command with message type 
   * "CheckFinishIngestDocument" and aggregate type "ingest-document".
   * The aggregate ID field must contain the value of the "ingest document ID" field.
   */
  public static CheckFinishIngestDocument = new MediaServiceMessagingSettings(
    'CheckFinishIngestDocument', 
    'inbox', 
    'ingest.check_finish_document',
    'command',
    'ingest-document'
    );
  /**
   * Defines the messaging settings for the event with message type 
   * "EntityDeleted" and aggregate type "entity".
   * The aggregate ID field contains the value of the "entity ID" field.
   */
  public static EntityDeleted = new MediaServiceMessagingSettings(
    'EntityDeleted', 
    'inbox', 
    'entity.deleted',
    'event',
    'entity'
    );
  
  public readonly serviceId = 'media-service';
  
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