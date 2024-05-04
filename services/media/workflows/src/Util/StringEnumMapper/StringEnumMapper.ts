import { Constants } from '../../constants';

export const getEnumLabel = (input: string): string =>
  Constants[input] ?? input;
