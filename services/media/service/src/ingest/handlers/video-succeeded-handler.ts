import { MessagingSettings } from '@axinom/mosaic-message-bus-abstractions';
import {
  EnsureVideoExistsAlreadyExistedEvent,
  EnsureVideoExistsCreationStartedEvent,
  RegisterCuePointsCommand,
  VideoServiceMultiTenantMessagingSettings,
} from '@axinom/mosaic-messages';
import { Logger, MosaicError } from '@axinom/mosaic-service-common';
import {
  StoreOutboxMessage,
  TypedTransactionalMessage,
} from '@axinom/mosaic-transactional-inbox-outbox';
import { CuePointsIngestElement, VideoMessageContext } from 'media-messages';
import { ClientBase } from 'pg';
import { selectExactlyOne, selectOne, update } from 'zapatos/db';
import { CommonErrors, Config, requestServiceAccountToken } from '../../common';
import { MediaGuardedTransactionalInboxMessageHandler } from '../../messaging';
import { IngestEntityProcessor } from '../models';
import { checkIsIngestEvent } from '../utils/check-is-ingest-event';
import { getIngestErrorMessage } from '../utils/ingest-validation';

export abstract class VideoSucceededHandler<
  TContent extends
    | EnsureVideoExistsAlreadyExistedEvent
    | EnsureVideoExistsCreationStartedEvent,
> extends MediaGuardedTransactionalInboxMessageHandler<TContent> {
  constructor(
    private readonly storeOutboxMessage: StoreOutboxMessage,
    private entityProcessors: IngestEntityProcessor[],
    messagingSettings: MessagingSettings,
    config: Config,
  ) {
    super(
      messagingSettings,
      ['INGESTS_EDIT', 'ADMIN'],
      new Logger({
        config,
        context: VideoSucceededHandler.name,
      }),
      config,
    );
  }

  override async handleMessage(
    { payload, metadata, id, aggregateId }: TypedTransactionalMessage<TContent>,
    ownerClient: ClientBase,
  ): Promise<void> {
    if (!checkIsIngestEvent(metadata, this.logger, id, aggregateId)) {
      return;
    }
    const messageContext = metadata.messageContext as VideoMessageContext;
    const ingestItem = await selectExactlyOne('ingest_items', {
      id: messageContext.ingestItemId,
    }).run(ownerClient);

    const processor = this.entityProcessors.find(
      (h) => h.type === ingestItem.type,
    );

    if (!processor) {
      throw new MosaicError({
        message: `Entity type '${ingestItem.type}' is not recognized. Please make sure that a correct ingest entity processor is registered for specified type.`,
        code: CommonErrors.IngestError.code,
      });
    }

    await processor.processVideo(
      ingestItem.entity_id,
      payload.video_id,
      messageContext,
      ownerClient,
    );

    await update(
      'ingest_item_steps',
      { status: 'SUCCESS', entity_id: payload.video_id },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);

    // We only process cue points for the main video.
    if (messageContext.videoType == 'MAIN') {
      const cuePointsIngestStep = await selectOne('ingest_item_steps', {
        ingest_item_id: messageContext.ingestItemId,
        type: 'CUE_POINTS',
      }).run(ownerClient);

      const cuePoints = ingestItem.item.data as CuePointsIngestElement;

      if (
        cuePointsIngestStep !== undefined &&
        cuePoints.cue_points !== undefined &&
        cuePoints.cue_points.length > 0
      ) {
        const cuePointsPayload: RegisterCuePointsCommand = {
          video_id: payload.video_id,
          skip_validation: true,
          cue_points: [],
          remove_missing: true,
        };

        for (const cuePoint of cuePoints.cue_points) {
          cuePointsPayload.cue_points.push({
            cue_point_type: cuePoint.cue_point_type,
            time_in_seconds: cuePoint.time_in_seconds,
            value: cuePoint.value,
          });
        }

        const registerCuePointsMessageSettings =
          VideoServiceMultiTenantMessagingSettings.RegisterCuePoints;
        const accessToken = await requestServiceAccountToken(this.config);

        await this.storeOutboxMessage<RegisterCuePointsCommand>(
          payload.video_id,
          registerCuePointsMessageSettings,
          cuePointsPayload,
          ownerClient,
          {
            envelopeOverrides: {
              auth_token: accessToken,
              message_context: {
                ingestItemId: messageContext.ingestItemId,
                ingestItemStepId: cuePointsIngestStep.id,
              },
            },
            options: {
              routingKey:
                registerCuePointsMessageSettings.getEnvironmentRoutingKey({
                  tenantId: this.config.tenantId,
                  environmentId: this.config.environmentId,
                }),
            },
          },
        );
      }
    }
  }

  override async handleErrorMessage(
    error: Error,
    { metadata }: TypedTransactionalMessage<TContent>,
    ownerClient: ClientBase,
    retry: boolean,
  ): Promise<void> {
    if (retry) {
      return;
    }
    const messageContext = metadata.messageContext as VideoMessageContext;

    await update(
      'ingest_item_steps',
      {
        status: 'ERROR',
        response_message: getIngestErrorMessage(
          error,
          'An unexpected error occurred while trying to update video relations.',
        ),
      },
      { id: messageContext.ingestItemStepId },
    ).run(ownerClient);
  }
}
