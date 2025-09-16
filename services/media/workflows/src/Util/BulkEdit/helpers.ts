import { BulkEditFieldConfigMap } from '@axinom/mosaic-ui';

export const labelMapper = <T extends BulkEditFieldConfigMap>(
  fields: Partial<T>,
  labelMap: {
    [key in keyof T]?: string;
  },
): void => {
  for (const key in fields) {
    const labelValue = labelMap[key];
    const fieldValue = fields[key];
    if (labelValue && fieldValue) {
      fieldValue.label = labelValue;
    }
  }
};

export const typeMapper = <T extends BulkEditFieldConfigMap>(
  fields: Partial<T>,
  typeMap: {
    [key in keyof T]?: string;
  },
): void => {
  for (const key in fields) {
    const typeValue = typeMap[key];
    const fieldValue = fields[key];
    if (typeValue && fieldValue) {
      fieldValue.type = typeValue;
    }
  }
};
