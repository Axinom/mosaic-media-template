import { ClientBase } from 'pg';
import { selectOne } from 'zapatos/db';
import { ingest_item_steps } from 'zapatos/schema';

/**
 * VideoEncodingFinished/VideoEncodingFailed events are not correlated to an
 * ingest item step via message context (they fire for any video, whether or
 * not it originated from ingest), so the affected step must be looked up by
 * the video ID that was stored on it (as entity_id) when the encoding job
 * was first accepted. If the same video was re-ingested, entity_id may match
 * more than one step, so the most recently created one is used.
 *
 * Only the id is selected since that is all callers need to target the
 * update - this avoids pulling/parsing the full row for high-volume events.
 */
export const findLatestVideoIngestItemStep = (
  videoId: string,
  ownerClient: ClientBase,
): Promise<Pick<ingest_item_steps.JSONSelectable, 'id'> | undefined> =>
  selectOne(
    'ingest_item_steps',
    { type: 'VIDEO', entity_id: videoId },
    {
      columns: ['id'],
      order: { by: 'created_date', direction: 'DESC' },
    },
  ).run(ownerClient);
