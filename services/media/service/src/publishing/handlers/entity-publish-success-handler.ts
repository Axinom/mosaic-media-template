import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import {
  CatalogServiceMessagingSettings,
  EntityPublishSuccessEvent,
} from 'media-messages';
import { Config } from '../../common';
import { publishHandlerPermissions } from '../../domains/publishing-definition';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging/transactional-outbox-inbox/media-guard-transactional-message-handler';

export class EntityPublishSuccessHandler extends MediaGuardedTransactionalInboxMessageHandler<EntityPublishSuccessEvent> {
  constructor(config: Config) {
    super(
      CatalogServiceMessagingSettings.EntityPublishSuccess,
      publishHandlerPermissions,
      new Logger({
        config,
        context: EntityPublishSuccessHandler.name,
      }),
      config,
    );
  }

  override async handleMessage({
    payload,
  }: TypedTransactionalMessage<EntityPublishSuccessEvent>): Promise<void> {
    this.logger.debug({
      message: `Catalog service successfully processed published asset with ID ${payload.content_id}`,
    });
  }
}
