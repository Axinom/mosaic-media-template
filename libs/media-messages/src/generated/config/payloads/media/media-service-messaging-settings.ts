import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class MediaServiceMessagingSettings implements MessagingSettings {
  public static DeleteEntity = new MediaServiceMessagingSettings(
    'DeleteEntity', 
    'entity:delete', 
    'entity.delete',
    'command',
    'entity'
    );
  public static PublishEntity = new MediaServiceMessagingSettings(
    'PublishEntity', 
    'entity:publish_entity', 
    'entity.publish_entity',
    'command',
    'entity'
    );
  public static UnpublishEntity = new MediaServiceMessagingSettings(
    'UnpublishEntity', 
    'entity:unpublish_entity', 
    'entity.unpublish_entity',
    'command',
    'entity'
    );
  public static StartIngest = new MediaServiceMessagingSettings(
    'StartIngest', 
    'ingest:start', 
    'ingest.start',
    'command',
    'ingest-document'
    );
  public static StartIngestItem = new MediaServiceMessagingSettings(
    'StartIngestItem', 
    'ingest:start_item', 
    'ingest.start_item',
    'command',
    'ingest-item'
    );
  public static UpdateMetadata = new MediaServiceMessagingSettings(
    'UpdateMetadata', 
    'ingest:update_metadata', 
    'ingest.update_metadata',
    'command',
    'ingest-item'
    );
  public static CheckFinishIngestItem = new MediaServiceMessagingSettings(
    'CheckFinishIngestItem', 
    'ingest:check_finish_item', 
    'ingest.check_finish_item',
    'command',
    'ingest-item'
    );
  public static CheckFinishIngestDocument = new MediaServiceMessagingSettings(
    'CheckFinishIngestDocument', 
    'ingest:check_finish_document', 
    'ingest.check_finish_document',
    'command',
    'ingest-document'
    );
  public static EntityDeleted = new MediaServiceMessagingSettings(
    'EntityDeleted', 
    'entity:deleted', 
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