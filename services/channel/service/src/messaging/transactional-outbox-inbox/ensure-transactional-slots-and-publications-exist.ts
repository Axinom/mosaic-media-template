import {
  ensureReplicationSlotAndPublicationExist,
  OwnerPgPool,
} from '@axinom/mosaic-db-common';
import { Logger } from '@axinom/mosaic-service-common';

export const ensureTransactionalSlotsAndPublicationsExist = async (
  transactionalInboxReplicationSlot: string,
  transactionalOutboxReplicationSlot: string,
  transactionalInboxPublication: string,
  transactionalOutboxPublication: string,
  ownerPool: OwnerPgPool,
  logger: Logger,
): Promise<void> => {
  await ensureReplicationSlotAndPublicationExist({
    replicationPgPool: ownerPool,
    replicationSlotName: transactionalInboxReplicationSlot,
    publicationName: transactionalInboxPublication,
    tableNames: ['inbox'],
    schemaName: 'app_hidden',
    operationsToWatch: ['insert'],
    logger,
  });
  await ensureReplicationSlotAndPublicationExist({
    replicationPgPool: ownerPool,
    replicationSlotName: transactionalOutboxReplicationSlot,
    publicationName: transactionalOutboxPublication,
    tableNames: ['outbox'],
    schemaName: 'app_hidden',
    operationsToWatch: ['insert'],
    logger,
  });
};
