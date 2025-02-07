import { MosaicError } from '@axinom/mosaic-service-common';
import { Client } from 'pg';
import { Queryable } from 'zapatos/db';
import { CommonErrors } from '../../../../common';

/**
 * Validates if the child collection is not a parent of the parent collection (Circular relation)
 * If it is, it throws an error
 *
 * @param pgClient
 * @param collectionId
 * @param childCollectionId
 */
export const assertCircularCollectionRelation = async (
  pgClient: Client | Queryable,
  collectionId: string,
  childCollectionId: string,
): Promise<void> => {
  const query = `
          WITH RECURSIVE search_cycle AS (          
          SELECT 
            cr.child_collection_id AS current,
            ARRAY[$2, cr.child_collection_id] AS path
          FROM collection_relations cr
          WHERE cr.collection_id = $2
          
          UNION ALL
          
          SELECT 
            cr.child_collection_id AS current,
            sc.path || cr.child_collection_id AS path
          FROM search_cycle sc
          JOIN collection_relations cr 
            ON sc.current = cr.collection_id
          WHERE NOT (cr.child_collection_id = ANY(sc.path))
        )
        SELECT DISTINCT *
        FROM search_cycle
        WHERE current = $1;
        `;

  const values = [collectionId, childCollectionId];
  const collectionRelation = await pgClient.query(query, values);
  if (collectionRelation.rows.length > 0) {
    throw new MosaicError(CommonErrors.CircularCollectionRelationNotAllowed);
  }
};
