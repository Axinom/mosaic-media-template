import Ajv from 'ajv-v6';
import * as draft04 from 'ajv-v6/lib/refs/json-schema-draft-04.json';
import { singularize } from 'graphile-build';
import { PublishEntityCommand } from 'media-messages';
import { v4 as uuidv4 } from 'uuid';
import { SnapshotStateEnum } from 'zapatos/custom';
import { Queryable } from 'zapatos/db';
import { Table } from 'zapatos/schema';
import { Config } from '../../common';
import { SnapshotValidationResult } from '../models';

export type PublishAction = PublishEntityCommand['publish_options']['action'];

/**
 * Generates a snapshot job ID, which is used to group snapshots created during a bulk operation.
 */
export function generateSnapshotJobId(): string {
  // Right now it's UUID but we may want to use something else.
  return uuidv4();
}

/**
 * Builds a content entity ID for publishing.
 * @param table - Name of the table, used as content entity type.
 * @param entityId - ID of the content entity.
 */
export function buildPublishingId(
  table: Table,
  entityId: number | string,
): string {
  return `${singularize(table)}-${entityId}`;
}

let ajv: Ajv.Ajv;
/**
 * Returns an Ajv (v6) instance that's configured to use draft-04 meta schema.
 */
export function getAjv(): Ajv.Ajv {
  if (ajv) {
    return ajv;
  }

  ajv = new Ajv({
    schemaId: 'id',
    allErrors: true,
    jsonPointers: true,
  });
  ajv.addMetaSchema(draft04);

  return ajv;
}

/**
 * Snapshot states from which it is possible to publish a snapshot. Includes READY, UNPUBLISHED, and SCHEDULED.
 */
export const PUBLISHABLE_SNAPSHOT_STATES: SnapshotStateEnum[] = [
  'READY',
  'UNPUBLISHED',
  'SCHEDULED',
];

/**
 * Snapshot states from which it is possible to unpublish a snapshot. Includes PUBLISHED and UNPUBLISHED.
 */
export const UNPUBLISHABLE_SNAPSHOT_STATES: SnapshotStateEnum[] = [
  'PUBLISHED',
  'UNPUBLISHED',
];

export interface SnapshotAggregationResults {
  validation: SnapshotValidationResult[];
  result: unknown;
}

/**
 * Aggregates all the data that is necessary to create a content entity snapshot.
 */
export interface SnapshotDataAggregator {
  (
    entityId: number,
    authToken: string,
    config: Config,
    queryable: Queryable,
  ): Promise<SnapshotAggregationResults>;
}

export interface CustomSchemaValidator {
  (json: unknown): Promise<SnapshotValidationResult[]>;
}

/**
 * Validates snapshot data.
 */
export interface SnapshotDataValidator {
  (
    data: SnapshotAggregationResults,
    jsonSchema?: Record<string, unknown>,
    customValidation?: CustomSchemaValidator,
  ): Promise<SnapshotValidationResult[]>;
}
export interface UnpublishMessage {
  content_id: string;
}
