import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';

export interface LocalizationMessageData {
  settings: LocalizationServiceMultiTenantMessagingSettings;
  payload:
    | DeleteLocalizationSourceEntityCommand
    | UpsertLocalizationSourceEntityCommand;
}
