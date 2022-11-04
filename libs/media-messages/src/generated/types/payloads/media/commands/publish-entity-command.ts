import { PublishOptions } from '../types/publish-options';
/**
 * Command to publish an entity.
 */
export interface PublishEntityCommand {
  /**
   * The name of the database table to use.
   */
  table_name: string;
  /**
   * Id of the selected entity.
   */
  entity_id: number;
  /**
   * Publish job ID, bulk published items will share the same ID.
   */
  job_id?: string;
  /**
   * Snapshot publish options.
   */
  publish_options: PublishOptions;
}