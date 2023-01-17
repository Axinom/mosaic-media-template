import {
  ChannelServiceMultiTenantMessagingSettings,
  PlaylistPublishedEvent,
} from '@axinom/mosaic-messages';
import {
  WebhookRequestMessage,
  WebhookResponse,
} from '@axinom/mosaic-service-common';
import { ValidationErrors } from '../../common';
import { validateVideo, ValidationResult } from './utils';
import { ValidationWebhookHandler } from './validation-webhook-model';

export class PlaylistPublishedValidationWebhookHandler
  implements ValidationWebhookHandler<PlaylistPublishedEvent>
{
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
    }

    const diffInHours = this.getHoursDiff(
      event.start_date_time,
      event.end_date_time,
    );
    // Return a warning if the total playlist length exceeds 24 hours.
    if (diffInHours >= 24 && diffInHours < 25) {
      validationResult.warnings.push(ValidationErrors.PlaylistExceeds24Hours);
    }
    // Return an error if the total playlist length exceeds 25 hours.
    if (diffInHours >= 25) {
      validationResult.errors.push(ValidationErrors.PlaylistExceeds25Hours);
    }
    return {
      payload: validationResult.errors.length > 0 ? null : event,
      ...validationResult,
    };
  }

  private getHoursDiff(startDate: string, endDate: string): number {
    const msInHour = 1000 * 60 * 60;

    return (
      Math.floor(new Date(endDate).getTime() - new Date(startDate).getTime()) /
      msInHour
    );
  }
}
