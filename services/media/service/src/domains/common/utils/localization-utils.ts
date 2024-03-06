import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { LocalizationMessageData } from '../models';

export const getUpsertMessageData = (
  serviceId: string,
  entityType: string,
  entityId: number,
  fields: Record<string, unknown>,
  entityTitle: string | undefined,
  imageId: string | null | undefined,
): LocalizationMessageData => {
  const payload: UpsertLocalizationSourceEntityCommand = {
    service_id: serviceId,
    entity_type: entityType,
    entity_id: entityId.toString(),
    entity_title: entityTitle,
    image_id: imageId,
    fields,
  };
  return {
    settings:
      LocalizationServiceMultiTenantMessagingSettings.UpsertLocalizationSourceEntity,
    payload,
  };
};

export const getDeleteMessageData = (
  serviceId: string,
  entityType: string,
  entityId: number,
): LocalizationMessageData => {
  const payload: DeleteLocalizationSourceEntityCommand = {
    service_id: serviceId,
    entity_type: entityType,
    entity_id: entityId.toString(),
  };
  return {
    settings:
      LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
    payload: payload,
  };
};
