import { UNKNOWN_AGGREGATE_ID } from '@axinom/mosaic-message-bus';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import { StoreOutboxMessage } from '@axinom/mosaic-transactional-inbox-outbox';
import { PublishServiceMessagingSettings } from 'media-messages';
import { ClientBase } from 'pg';
import * as db from 'zapatos/db';
import { insert, JSONOnlyColsForTable, selectOne, update } from 'zapatos/db';
import { CommonErrors, Config } from '../../common';
import { EntityPublishingProcessor } from '../models';
import { commonPublishValidator } from './common-publish-validator';
import {
  PUBLISHABLE_SNAPSHOT_STATES,
  UNPUBLISHABLE_SNAPSHOT_STATES,
  UnpublishMessage,
} from './publishing-common';

/**
 * A "wrapper" around the snapshots.Updatable object to encapsulate all business logic.
 */
export class SnapshotWrapper {
  private readonly logger: Logger;

  constructor(
    private readonly snapshotId: number,
    private readonly dbClient: ClientBase,
    private storeOutboxMessage: StoreOutboxMessage,
    config: Config,
  ) {
    this.logger = new Logger({ config, context: SnapshotWrapper.name });
  }

  /**
   * Performs data aggregation and validation based on passed publish processor.
   * config and authToken parameters are needed if aggregation process would
   * make request to other services.
   */
  public async prepareAndValidate(
    processor: EntityPublishingProcessor,
    config: Config,
    authToken?: string,
  ): Promise<void> {
    const snapshot = await this.getSnapshot();

    if (snapshot.snapshot_state !== 'INITIALIZATION') {
      this.logger.debug({
        message: `Snapshot aggregation and validation skipped. Snapshot with id '${this.snapshotId}' has a state that is not INITIALIZATION.`,
        details: { state: snapshot.snapshot_state },
      });
      return;
    }

    const aggregation = await processor.aggregator(
      snapshot.entity_id,
      authToken ?? '',
      config,
      this.dbClient,
    );

    const results = await commonPublishValidator(
      aggregation,
      processor.validationSchema,
      processor.validator,
    );

    // Ensure that snapshot references are correctly set.
    const insertableErrors = results.map((error) => ({
      snapshot_id: this.snapshotId,
      entity_type: snapshot.entity_type,
      ...error,
    }));

    await insert('snapshot_validation_results', insertableErrors).run(
      this.dbClient,
    );

    const hasErrors = results.some((r) => r.severity === 'ERROR');
    const hasWarnings = results.some((r) => r.severity === 'WARNING');
    await db
      .update(
        'snapshots',
        {
          snapshot_json: aggregation.result as db.JSONValue,
          snapshot_state: hasErrors ? 'INVALID' : 'READY',
          validation_status: hasErrors
            ? 'ERRORS'
            : hasWarnings
            ? 'WARNINGS'
            : 'OK',
        },
        { id: this.snapshotId },
      )
      .run(this.dbClient);
  }

  /**
   * Publishes a snapshot to the catalog service.
   * @param messagingSettings - Messaging settings for routing.
   * @param authToken - Authentication token to pass into the message.
   */
  public async publish(
    messagingSettings: PublishServiceMessagingSettings,
    authToken: string | undefined,
  ): Promise<void> {
    const snapshot = await this.getSnapshot();

    if (!PUBLISHABLE_SNAPSHOT_STATES.includes(snapshot.snapshot_state)) {
      this.logger.debug({
        message: `Cannot publish snapshot which state is '${snapshot.snapshot_state}'.`,
        details: { publishableStates: PUBLISHABLE_SNAPSHOT_STATES },
      });
      return;
    }

    // TODO: Check for version compatibility

    if (!snapshot.snapshot_json) {
      this.logger.error({
        message: 'Snapshot has a valid state, but snapshot_json is empty.',
        details: {
          snapshotId: this.snapshotId,
          state: snapshot.snapshot_state,
        },
      });
      await update(
        'snapshots',
        { snapshot_state: 'ERROR' },
        { id: this.snapshotId },
      ).run(this.dbClient);
      return;
    }

    await update(
      'snapshots',
      {
        snapshot_state: 'UNPUBLISHED',
        unpublished_date: new Date(),
      },
      {
        entity_id: snapshot.entity_id,
        entity_type: snapshot.entity_type,
        snapshot_state: 'PUBLISHED',
      },
    ).run(this.dbClient);

    await this.storeOutboxMessage(
      snapshot.entity_id > 0
        ? snapshot.entity_id.toString()
        : UNKNOWN_AGGREGATE_ID,
      messagingSettings,
      snapshot.snapshot_json,
      this.dbClient,
      { envelopeOverrides: { auth_token: authToken } },
    );

    await update(
      'snapshots',
      { snapshot_state: 'PUBLISHED', published_date: new Date() },
      { id: this.snapshotId },
    ).run(this.dbClient);
  }

  /**
   * Unpublishes a snapshot i.e. sends an unpublish message to remove data from the catalog service.
   * @param messagingSettings - Messaging settings from the corresponding unpublish handler for routing.
   * @param authToken - Authentication token to pass into the message.
   */
  public async unpublish(
    messagingSettings: PublishServiceMessagingSettings,
    authToken: string | undefined,
  ): Promise<void> {
    const snapshot = await this.getSnapshot();

    if (!UNPUBLISHABLE_SNAPSHOT_STATES.includes(snapshot.snapshot_state)) {
      this.logger.debug({
        message: `Cannot unpublish snapshot which state is '${snapshot.snapshot_state}'.`,
        details: { unpublishableStates: UNPUBLISHABLE_SNAPSHOT_STATES },
      });
      return;
    }

    await this.storeOutboxMessage<UnpublishMessage>(
      snapshot.id.toString(),
      messagingSettings,
      { content_id: snapshot.publish_id },
      this.dbClient,
      { envelopeOverrides: { auth_token: authToken } },
    );

    await update(
      'snapshots',
      { snapshot_state: 'UNPUBLISHED', unpublished_date: new Date() },
      { id: this.snapshotId },
    ).run(this.dbClient);
  }

  private async getSnapshot(): Promise<
    JSONOnlyColsForTable<
      'snapshots',
      (
        | 'id'
        | 'snapshot_state'
        | 'publish_id'
        | 'snapshot_json'
        | 'entity_type'
        | 'entity_id'
      )[]
    >
  > {
    const snapshot = await selectOne(
      'snapshots',
      { id: this.snapshotId },
      {
        columns: [
          'id',
          'snapshot_state',
          'publish_id',
          'snapshot_json',
          'entity_type',
          'entity_id',
        ],
      },
    ).run(this.dbClient);

    if (!snapshot) {
      throw new MosaicError({
        ...CommonErrors.SnapshotNotFound,
        messageParams: [this.snapshotId],
      });
    }
    return snapshot;
  }
}
