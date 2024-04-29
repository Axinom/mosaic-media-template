export * from './check-finish-ingest-document-command';
export * from './delete-entity-command';
export * from './publish-entity-command';
export * from './start-ingest-command';
export * from './start-ingest-item-command';
export * from './unpublish-entity-command';
export * from './update-metadata-command';

export enum MediaCommandsSchemas {
  CheckFinishIngestDocumentCommand = 'payloads/media/commands/check-finish-ingest-document-command.json',
  DeleteEntityCommand = 'payloads/media/commands/delete-entity-command.json',
  PublishEntityCommand = 'payloads/media/commands/publish-entity-command.json',
  StartIngestCommand = 'payloads/media/commands/start-ingest-command.json',
  StartIngestItemCommand = 'payloads/media/commands/start-ingest-item-command.json',
  UnpublishEntityCommand = 'payloads/media/commands/unpublish-entity-command.json',
  UpdateMetadataCommand = 'payloads/media/commands/update-metadata-command.json'
}

export enum MediaCommandsTypes {
  CheckFinishIngestDocumentCommand = 'CheckFinishIngestDocumentCommand',
  DeleteEntityCommand = 'DeleteEntityCommand',
  PublishEntityCommand = 'PublishEntityCommand',
  StartIngestCommand = 'StartIngestCommand',
  StartIngestItemCommand = 'StartIngestItemCommand',
  UnpublishEntityCommand = 'UnpublishEntityCommand',
  UpdateMetadataCommand = 'UpdateMetadataCommand'
}