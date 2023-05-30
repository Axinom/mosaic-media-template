import { PublishActionType } from './publish-action-type';
/**
 * Snapshot publish options.
 */
export interface PublishOptions {
  /**
   * Publish action type.
   */
  action: PublishActionType;
  /**
   * When to publish in case of scheduled publication.
   */
  schedule_time?: string;

  [k: string]: unknown;
}