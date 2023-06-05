import { Dict } from '@axinom/mosaic-db-common';
import {
  DeleteLocalizationSourceEntityCommand,
  LocalizationServiceMultiTenantMessagingSettings,
  UpsertLocalizationSourceEntityCommand,
  UpsertLocalizationSourceEntityFields,
} from '@axinom/mosaic-messages';
import { MosaicError } from '@axinom/mosaic-service-common';
import { Table } from 'zapatos/schema';
import { InternalErrors } from '../../../common';
import { LocalizationMessageData } from '../models';

export const getUpsertMessageData = (
  serviceId: string,
  entityType: string,
  entityId: number,
  fields: UpsertLocalizationSourceEntityFields,
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

export const assertLocalizationData: (
  data: Dict<unknown> | undefined,
  tableName: Table,
) => asserts data is Dict<unknown> = (
  data: Dict<unknown> | undefined,
  tableName: Table,
): asserts data is Dict<unknown> => {
  if (!data) {
    throw new MosaicError({
      ...InternalErrors.ReplicaDataNotFound,
      messageParams: [tableName],
    });
  }
};

export const assertLocalizationColumn = (
  data: Dict<unknown>,
  columnName: string,
  tableName: Table,
): void => {
  if (!(columnName in data)) {
    throw new MosaicError({
      ...InternalErrors.ReplicaColumnNotFound,
      messageParams: [columnName, tableName],
    });
  }
};
