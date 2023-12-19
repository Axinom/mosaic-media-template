import {
  ensureReplicationSlotAndPublicationExist,
  OwnerPgPool,
} from '@axinom/mosaic-db-common';
import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../..//common';

export const ensureTransactionalSlotsAndPublicationsExist = async (
  config: Config,
  ownerPool: OwnerPgPool,
  logger: Logger,
): Promise<void> => {
  await ensureReplicationSlotAndPublicationExist({
    replicationPgPool: ownerPool,
    replicationSlotName: config.transactionalOutboxReplicationSlot,
    publicationName: 'pg_transactional_outbox_publication',
    tableNames: ['outbox'],
    schemaName: 'app_hidden',
    operationsToWatch: ['insert'],
    logger,
  });
  await ensureReplicationSlotAndPublicationExist({
    replicationPgPool: ownerPool,
    replicationSlotName: config.transactionalInboxReplicationSlot,
    publicationName: 'pg_transactional_inbox_publication',
    tableNames: ['inbox'],
    schemaName: 'app_hidden',
    operationsToWatch: ['insert'],
    logger,
  });
};
