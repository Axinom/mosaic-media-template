import { Logger } from '@axinom/mosaic-service-common';
import { TypedTransactionalMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import EdgeGrid from 'akamai-edgegrid';
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

  purgeCdn = async (contentId: string): Promise<void> => {
    const purgeObject = {
      Objects: [`${this.config.akamaiCacheTagPrefix.trim()}${contentId}`],
    };
    const eg = new EdgeGrid(
      this.config.akamaiClientToken,
      this.config.akamaiClientSecret,
      this.config.akamaiAccessToken,
      this.config.akamaiCacheBaseUrl,
    );

    eg.auth({
      path: '/ccu/v3/delete/tag/production',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purgeObject),
    });

    eg.send((error) => {
      if (error) {
        this.logger.debug({
          message: `Akamai CDN purge failed with error ${JSON.stringify(
            error,
            Object.getOwnPropertyNames(error),
          )}, {}`,
        });
      }
    });
  };

  override async handleMessage({
    payload,
  }: TypedTransactionalMessage<EntityPublishSuccessEvent>): Promise<void> {
    await this.purgeCdn(payload.content_id);
  }
}
