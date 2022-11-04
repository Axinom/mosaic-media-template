import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class MediaServiceMessagingSettings implements MessagingSettings {
  public static DeleteEntity = new MediaServiceMessagingSettings(
    'DeleteEntity', 
    'entity:delete', 
    'entity.delete'
    );
  public static PublishEntity = new MediaServiceMessagingSettings(
    'PublishEntity', 
    'entity:publish_entity', 
    'entity.publish_entity'
    );
  public static UnpublishEntity = new MediaServiceMessagingSettings(
    'UnpublishEntity', 
    'entity:unpublish_entity', 
    'entity.unpublish_entity'
    );
  public static StartIngest = new MediaServiceMessagingSettings(
    'StartIngest', 
    'ingest:start', 
    'ingest.start'
    );
  public static StartIngestItem = new MediaServiceMessagingSettings(
    'StartIngestItem', 
    'ingest:start_item', 
    'ingest.start_item'
    );
  public static UpdateMetadata = new MediaServiceMessagingSettings(
    'UpdateMetadata', 
    'ingest:update_metadata', 
    'ingest.update_metadata'
    );
  public static CheckFinishIngestItem = new MediaServiceMessagingSettings(
    'CheckFinishIngestItem', 
    'ingest:check_finish_item', 
    'ingest.check_finish_item'
    );
  public static CheckFinishIngestDocument = new MediaServiceMessagingSettings(
    'CheckFinishIngestDocument', 
    'ingest:check_finish_document', 
    'ingest.check_finish_document'
    );
  public static EntityDeleted = new MediaServiceMessagingSettings(
    'EntityDeleted', 
    'entity:deleted', 
    'entity.deleted'
    );
  
  public readonly serviceId = 'media-service';
  
  private constructor(
    public readonly messageType: string,
    public readonly queue: string,
    public readonly routingKey: string,
  ) {
    
  }

  public toString = (): string => {
    return this.messageType;
  };
}