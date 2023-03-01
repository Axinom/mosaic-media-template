import {
  ChannelServiceMultiTenantMessagingSettings,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import {
  WebhookRequestMessage,
  WebhookResponse,
} from '@axinom/mosaic-service-common';
import { Config, ValidationErrors } from '../../common';
import { getHoursDifference, validateVideo, ValidationResult } from './utils';
import { ValidationWebhookHandler } from './validation-webhook-model';

export class PlaylistPublishedValidationWebhookHandler
  implements ValidationWebhookHandler<PlaylistPublishedEvent>
{
  constructor(private config: Config) {}

  canHandle(message: WebhookRequestMessage<PlaylistPublishedEvent>): boolean {
    return (
      message.message_type ===
      ChannelServiceMultiTenantMessagingSettings.PlaylistPublished.messageType
    );
  }
  handle(
    message: WebhookRequestMessage<PlaylistPublishedEvent>,
  ): WebhookResponse<PlaylistPublishedEvent> {
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
                  return [...result, validateVideo(schedule.video)];
                }
                return result;
              }, new Array<ValidationResult>());
          }
          return [...result, validateVideo(entry.video), ...scheduleResult];
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

        //determine if playlist start date is older than 24 hours in the past
        const playlistStartTimeComparedToNow = getHoursDifference(
          event.start_date_time,
          new Date().toISOString(),
        );
        if (playlistStartTimeComparedToNow >= 24) {
          validationResult.errors.push(ValidationErrors.PlaylistIsTooOld);
        }
      }
    }
    return {
      payload: validationResult.errors.length > 0 ? null : event,
      ...validationResult,
    };
  }
}
