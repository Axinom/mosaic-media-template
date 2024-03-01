import { RascalConfigBuilder } from '@axinom/mosaic-message-bus';
import { RabbitMqInboxWriter } from '@axinom/mosaic-transactional-inbox-outbox';
import { Config } from '../../common';

export interface ContentTypeRegistrant {
  /**
   * Registers all message handlers associated with a content type.
   * Typically there are two: one for handling published events and one for handling unpublished events.
   * @param inboxWriter - Writes the incoming RabbitMQ messages to the transactional inbox table
   * @param config - Catalog service configuration object.
   */
  (inboxWriter: RabbitMqInboxWriter, config: Config): RascalConfigBuilder[];
}
