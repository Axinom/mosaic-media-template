import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { Dict } from '@axinom/mosaic-service-common';

export interface LocalizationMessageData {
  settings: LocalizationServiceMultiTenantMessagingSettings;
  payload:
    | DeleteLocalizationSourceEntityCommand
    | UpsertLocalizationSourceEntityCommand;
}

export interface ReplicationOperationHandlers {
  insertHandler: (
    newData: Dict<unknown> | undefined,
  ) => Promise<LocalizationMessageData | undefined>;
  updateHandler: (
    newData: Dict<unknown> | undefined,
    oldData: Dict<unknown> | undefined,
  ) => Promise<LocalizationMessageData | undefined>;
  deleteHandler: (
    oldData: Dict<unknown> | undefined,
  ) => Promise<LocalizationMessageData | undefined>;
}
