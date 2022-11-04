import { MosaicError } from '@axinom/mosaic-service-common';
import { pluralize, singularize } from 'graphile-build';
import { EntityTypeEnum, SnapshotStateEnum } from 'zapatos/custom';
import {
  cols,
  insert,
  param,
  parent,
  Queryable,
  raw,
  select,
  selectExactlyOne,
  selectOne,
  SQL,
  sql,
  vals,
} from 'zapatos/db';
import { snapshots, Table } from 'zapatos/schema';
import { CommonErrors } from '../../common';
import { EntityListInfo } from '../models';
import { buildPublishingId } from './publishing-common';

export function buildEntityTableName(entityType: EntityTypeEnum): Table {
  return pluralize(entityType.toLowerCase()) as Table;
}

export function buildXrefTableName(entityTable: Table): Table {
  return `${entityTable}_snapshots` as Table;
}

export function buildXrefEntityFk(entityTable: Table): string {
  return `${singularize(entityTable.toLowerCase())}_id`;
}

export function gqlEntityNameToEntityType(entityName: string): EntityTypeEnum {
  return singularize(entityName.toLocaleUpperCase()) as EntityTypeEnum;
}

export async function getPublishedSnapshot(
  entityTable: Table,
  entityId: number,
  queryable: Queryable,
): Promise<snapshots.Selectable | undefined> {
  const xrefTableName = buildXrefTableName(entityTable);
  const xrefEntityFk = buildXrefEntityFk(entityTable);
  const published: SnapshotStateEnum = 'PUBLISHED';

  const publishedSnapshots = await sql<SQL, snapshots.Selectable[]>`
      SELECT
        s.*
      FROM
        ${'snapshots'} s
      INNER JOIN ${xrefTableName} es ON
        es.${'snapshot_id'} = s.${'id'}
      WHERE
        es.${raw(xrefEntityFk)} = ${param(entityId)}
        AND s.${'snapshot_state'} = ${param(published)}
      LIMIT 1
      `.run(queryable);

  return publishedSnapshots.length > 0 ? publishedSnapshots[0] : undefined;
}

/**
 * Creates a new snapshot together with a relation entry in a reference table.
 * @param entityType - a type of entity from which a snapshot is created.
 * @param entityId - id of an entity from which a snapshot is created.
 * @param jobId - publish job id of a uuid type.
 * @param queryable - database transaction client.
 */
export async function createSnapshotWithRelation(
  entityType: EntityTypeEnum,
  entityId: number,
  jobId: string,
  queryable: Queryable,
): Promise<snapshots.JSONSelectable> {
  // TODO: Ensure that these are actual valid table names.
  const entityTable = buildEntityTableName(entityType);
  const xrefTableName = buildXrefTableName(entityTable);
  const xrefEntityFk = buildXrefEntityFk(entityTable);

  const entity = await selectOne(entityTable, { id: entityId }).run(queryable);

  if (!entity) {
    throw new MosaicError({
      ...CommonErrors.MediaNotFound,
      messageParams: [entityType, entityId],
    });
  }

  // TODO: Consider moving the snapshot_no field to the xref table.
  const existingSnapshots = await select(
    xrefTableName,
    { [xrefEntityFk]: entityId },
    {
      lateral: selectExactlyOne(
        'snapshots',
        { id: parent('snapshot_id') },
        { columns: ['snapshot_no'] },
      ),
    },
  ).run(queryable);
  const snapshotNo =
    Math.max(...existingSnapshots.map((x) => x.snapshot_no).concat(0)) + 1;

  // 1. Create a new snapshot row.
  const titleResult = entity as { title: string };
  const entityTitle =
    'title' in titleResult
      ? titleResult.title
      : `${entityType} snapshot ${entityId}`;

  const snapshot = await insert('snapshots', {
    entity_id: entityId,
    entity_title: entityTitle,
    entity_type: entityType,
    snapshot_no: snapshotNo,
    job_id: jobId,
    publish_id: buildPublishingId(entityTable, entityId),
  }).run(queryable);

  // 2. Create a cross reference entry.
  const xref = {
    [xrefEntityFk]: entityId,
    snapshot_id: snapshot.id,
  };

  await sql`INSERT INTO ${xrefTableName} (${cols(xref)})
    VALUES (${vals(xref)})`.run(queryable);

  return snapshot;
}

/**
 * Creates a snapshot for a list of entities using an info object with an artificial constant info like entity_it.
 * Snapshot created in such a way will be an orphaned snapshot, since it it cannot have a concrete relation to a list of entities.
 * @param info - information to create a snapshot for a list of objects
 * @param jobId - publish job id of a uuid type.
 * @param queryable - database transaction client.
 */
export async function createListSnapshot(
  info: EntityListInfo,
  jobId: string,
  queryable: Queryable,
): Promise<snapshots.JSONSelectable> {
  const existingSnapshots = await select(
    'snapshots',
    { entity_type: info.type },
    { columns: ['snapshot_no'] },
  ).run(queryable);
  const snapshotNo =
    Math.max(...existingSnapshots.map((x) => x.snapshot_no).concat(0)) + 1;

  return insert('snapshots', {
    entity_id: info.id,
    entity_type: info.type,
    entity_title: info.title,
    snapshot_no: snapshotNo,
    job_id: jobId,
    publish_id: buildPublishingId(info.table, info.id),
    is_list_snapshot: true,
  }).run(queryable);
}
