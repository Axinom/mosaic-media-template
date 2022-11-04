import { getEnumLabel } from '../StringEnumMapper/StringEnumMapper';

export const StringEnumRenderer = (val: unknown): string => {
  if (val) {
    return getEnumLabel(String(val));
  }

  return '';
};
