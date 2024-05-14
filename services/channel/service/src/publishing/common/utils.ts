/**
 * Builds a content entity ID for publishing.
 * @param entityType - The entity type name
 * @param entityId - ID of the content entity.
 */
export function buildPublishingId(
  entityType: 'CHANNEL' | 'PLAYLIST' | 'PROGRAM' | 'MOVIE' | 'EPISODE',
  entityId: number | string,
): string {
  return `${entityType.toLowerCase()}-${entityId}`;
}
