export * from './entity-deleted-event';
export * from './localizable-image-ingest-finished-event';

export enum MediaEventsSchemas {
  EntityDeletedEvent = 'payloads/media/events/entity-deleted-event.json',
  LocalizableImageIngestFinishedEvent = 'payloads/media/events/localizable-image-ingest-finished-event.json'
}

export enum MediaEventsTypes {
  EntityDeletedEvent = 'EntityDeletedEvent',
  LocalizableImageIngestFinishedEvent = 'LocalizableImageIngestFinishedEvent'
}