export * from './entity-publish-failed-event';
export * from './entity-publish-success-event';

export enum CatalogEventsSchemas {
  EntityPublishFailedEvent = 'payloads/catalog/events/entity-publish-failed-event.json',
  EntityPublishSuccessEvent = 'payloads/catalog/events/entity-publish-success-event.json'
}

export enum CatalogEventsTypes {
  EntityPublishFailedEvent = 'EntityPublishFailedEvent',
  EntityPublishSuccessEvent = 'EntityPublishSuccessEvent'
}