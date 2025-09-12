import { BulkEditFieldConfigMap } from '@axinom/mosaic-ui';

export const labelMapper = <T extends BulkEditFieldConfigMap>(
  fields: Partial<T>,
  labelMap: {
    [key in keyof T]?: string;
  },
): void => {
  for (const key in fields) {
    if (labelMap[key] && fields[key]) {
      fields[key].label = labelMap[key];
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
    if (typeMap[key] && fields[key]) {
      fields[key].type = typeMap[key];
    }
  }
};
