import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';

export class MediaServiceMessagingSettings implements MessagingSettings {
  public static DeleteEntity = new MediaServiceMessagingSettings(
    'DeleteEntity', 
    'inbox', 
    'entity.delete',
    'command',
    'entity'
    );
  public static PublishEntity = new MediaServiceMessagingSettings(
    'PublishEntity', 
    'inbox', 
    'entity.publish_entity',
    'command',
    'entity'
    );
  public static UnpublishEntity = new MediaServiceMessagingSettings(
    'UnpublishEntity', 
    'inbox', 
    'entity.unpublish_entity',
    'command',
    'entity'
    );
  public static StartIngest = new MediaServiceMessagingSettings(
    'StartIngest', 
    'inbox', 
    'ingest.start',
    'command',
    'ingest-document'
    );
  public static StartIngestItem = new MediaServiceMessagingSettings(
    'StartIngestItem', 
    'inbox', 
    'ingest.start_item',
    'command',
    'ingest-item'
    );
  public static UpdateMetadata = new MediaServiceMessagingSettings(
    'UpdateMetadata', 
    'inbox', 
    'ingest.update_metadata',
    'command',
    'ingest-item'
    );
  public static CheckFinishIngestItem = new MediaServiceMessagingSettings(
    'CheckFinishIngestItem', 
    'inbox', 
    'ingest.check_finish_item',
    'command',
    'ingest-item'
    );
  public static CheckFinishIngestDocument = new MediaServiceMessagingSettings(
    'CheckFinishIngestDocument', 
    'inbox', 
    'ingest.check_finish_document',
    'command',
    'ingest-document'
    );
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