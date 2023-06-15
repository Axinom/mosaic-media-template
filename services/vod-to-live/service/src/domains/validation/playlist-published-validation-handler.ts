import {
  ChannelServiceMultiTenantMessagingSettings,
  DetailedVideo,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import {
  WebhookRequestMessage,
  WebhookResponse,
} from '@axinom/mosaic-service-common';
import { Config, ValidationErrors } from '../../common';
import { AzureStorage } from '../azure';
import { ChannelMetadataModel } from '../common';
import { generateChannelFilePath, metadataFileName } from '../live-stream';
import { extractSharedVideoStreamFormats } from '../smil';
import { getHoursDifference, validateVideo, ValidationResult } from './utils';
import { ValidationWebhookHandler } from './validation-webhook-model';

export class PlaylistPublishedValidationWebhookHandler
  implements ValidationWebhookHandler<PlaylistPublishedEvent>
{
  constructor(private config: Config, private storage: AzureStorage) {}

  canHandle(message: WebhookRequestMessage<PlaylistPublishedEvent>): boolean {
    return (
      message.message_type ===
      ChannelServiceMultiTenantMessagingSettings.PlaylistPublished.messageType
    );
  }
  async handle(
    message: WebhookRequestMessage<PlaylistPublishedEvent>,
  ): Promise<WebhookResponse<PlaylistPublishedEvent>> {
    const validationResult: ValidationResult = {
      errors: [],
      warnings: [],
    };
    const event = message.payload;
    // There is at least one program item otherwise it returns an error.
    if (
      event.programs === null ||
      event.programs === undefined ||
      (event.programs && event.programs.length === 0)
    ) {
      validationResult.errors.push(ValidationErrors.PlaylistMissingPrograms);
    } else {
      const result: ValidationResult[] = event.programs.reduce(
        (result, entry) => {
          let scheduleResult: ValidationResult[] = [];
          if (entry.program_cue_points) {
            scheduleResult = entry.program_cue_points
              .flatMap((cp) => cp.schedules)
              .reduce((result, schedule) => {
                if (schedule?.video) {
                  return [
                    ...result,
                    validateVideo(schedule.video, this.config),
                  ];
                }
                return result;
              }, new Array<ValidationResult>());
          }
          return [
            ...result,
            validateVideo(entry.video, this.config),
            ...scheduleResult,
          ];
        },
        new Array<ValidationResult>(),
      );
      validationResult.errors.push(...result.flatMap((r) => r.errors));
      validationResult.warnings.push(...result.flatMap((r) => r.warnings));

      // determine the length of playlist in hours
      const diffInHours = getHoursDifference(
        event.start_date_time,
        event.end_date_time,
      );
      // Return a warning if the total playlist length exceeds 24 hours.
      if (diffInHours > 24 && diffInHours < 25) {
        validationResult.warnings.push(ValidationErrors.PlaylistExceeds24Hours);
      }
      // Return an error if the total playlist length exceeds 25 hours.
      if (diffInHours >= 25) {
        validationResult.errors.push(ValidationErrors.PlaylistExceeds25Hours);
      }

      if (this.config.prolongPlaylistTo24Hours) {
        //Informative warning, that playlist is under 24 hours and will be prolonged with placeholder videos
        if (diffInHours < 24) {
          validationResult.warnings.push(ValidationErrors.PlaylistProlongation);
        }
      }

      //determine if playlist start date is older than 24 hours in the past
      const playlistStartTimeComparedToNow = getHoursDifference(
        event.start_date_time,
        new Date().toISOString(),
      );
      if (playlistStartTimeComparedToNow >= 24) {
        validationResult.errors.push(ValidationErrors.PlaylistIsTooOld);
      }

      // Playlist cannot start and end with an AD_POD (integration with AIP breaks on playlist loop)
      const firstSchedule = event.programs
        ?.reduce((prev, curr) => {
          return prev.sort_index < curr.sort_index ? prev : curr;
        })
        ?.program_cue_points?.find((x) => x.type === 'PRE')
        ?.schedules?.reduce((prev, curr) => {
          return prev.sort_index < curr.sort_index ? prev : curr;
        });
      const lastSchedule = event.programs
        ?.reduce((prev, curr) => {
          return prev.sort_index > curr.sort_index ? prev : curr;
        })
        ?.program_cue_points?.find((x) => x.type === 'POST')
        ?.schedules?.reduce((prev, curr) => {
          return prev.sort_index > curr.sort_index ? prev : curr;
        });

      if (firstSchedule?.type === 'AD_POD' && lastSchedule?.type === 'AD_POD') {
        validationResult.errors.push(
          ValidationErrors.PlaylistCannotStartAndEndWithAdPod,
        );
      }

      // Check for all videos in playlist to have at least one mutual stream format.
      // Mutual video stream format(s) are required to create consistent Live Stream.
      const channelJson = await this.storage.getFileContent(
        generateChannelFilePath(event.channel_id, metadataFileName),
      );
      const channelPublishedEvent: ChannelMetadataModel =
        JSON.parse(channelJson);
      const placeholderVideo: DetailedVideo | undefined =
        channelPublishedEvent?.placeholder_video;

      if (placeholderVideo) {
        const videos =
          event.programs?.reduce((result, entry) => {
            let scheduleResult: DetailedVideo[] = [];
            if (entry.program_cue_points) {
              scheduleResult = entry.program_cue_points
                .flatMap((cp) => cp.schedules)
                .reduce((result, schedule) => {
                  if (schedule?.video) {
                    return [...result, schedule.video];
                  }
                  return result;
                }, new Array<DetailedVideo>());
            }
            return [...result, entry.video, ...scheduleResult];
          }, new Array<DetailedVideo>()) ?? [];
        const mutualStreams = extractSharedVideoStreamFormats([
          ...videos,
          placeholderVideo,
        ]);
        if (mutualStreams.length < 1) {
          validationResult.errors.push(
            ValidationErrors.PlaylistVideosHaveNoMutualStreams,
          );
        }
      } else {
        validationResult.errors.push(
          ValidationErrors.PlaylistPlaceholderVideoWasNotFound,
        );
      }
    }
    return {
      payload: validationResult.errors.length > 0 ? null : event,
      ...validationResult,
    };
  }
}
