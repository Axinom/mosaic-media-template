import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CatalogServiceMessagingSettings,
  EntityPublishFailedEvent,
} from 'media-messages';
import { Config } from '../../common';
import { publishHandlerPermissions } from '../../domains/publishing-definition';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging/transactional-outbox-inbox/media-guard-transactional-message-handler';

export class EntityPublishFailedHandler extends MediaGuardedTransactionalInboxMessageHandler<EntityPublishFailedEvent> {
  constructor(config: Config) {
    super(
      CatalogServiceMessagingSettings.EntityPublishFailed,
      publishHandlerPermissions,
      new Logger({
        config,
        context: EntityPublishFailedHandler.name,
      }),
      config,
    );
  }

  override async handleMessage({
    payload,
  }: TypedTransactionalMessage<EntityPublishFailedEvent>): Promise<void> {
    this.logger.debug({
      message: `Catalog service failed to process published asset with ID ${payload.content_id}`,
      details: { message: payload.message },
    });
  }
}
