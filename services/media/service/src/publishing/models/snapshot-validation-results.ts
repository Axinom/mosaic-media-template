import { snapshot_validation_results } from 'zapatos/schema';

export type SnapshotValidationResult = Omit<
  snapshot_validation_results.Insertable,
  'id' | 'snapshot_id' | 'entity_type'
>;
