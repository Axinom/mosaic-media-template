import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
} from '@axinom/mosaic-messages';
import { LocalizationMessageData } from './localizable-transactional-inbox-message-handler';

export const getLocalizationUpsertMessageData = (
  serviceId: string,
  entityType: string,
  entityId: string,
  fields: Record<string, unknown>,
  entityTitle: string | undefined,
  imageId: string | null | undefined,
): LocalizationMessageData => {
  const payload: UpsertLocalizationSourceEntityCommand = {
    service_id: serviceId,
    entity_type: entityType,
    entity_id: entityId,
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

export const getLocalizationDeleteMessageData = (
  serviceId: string,
  entityType: string,
  entityId: string,
): LocalizationMessageData => {
  const payload: DeleteLocalizationSourceEntityCommand = {
    service_id: serviceId,
    entity_type: entityType,
    entity_id: entityId,
  };
  return {
    settings:
      LocalizationServiceMultiTenantMessagingSettings.DeleteLocalizationSourceEntity,
    payload: payload,
  };
};
