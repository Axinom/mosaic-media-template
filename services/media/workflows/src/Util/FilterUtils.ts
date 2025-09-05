import {
  Data,
  FilterType,
  FilterTypes,
  FilterValidatorFunction,
} from '@axinom/mosaic-ui';

export function createTextFilter<T extends Data>(
  label: string,
  property: keyof T,
): FilterType<T> {
  return {
    label,
    property,
    type: FilterTypes.FreeText,
  };
}

export function createSearchableFilter<T extends Data, K>(
  label: string,
  property: keyof T,
  items: K[] | undefined,
  labelSelector: (item: K) => string,
  placeholder: string,
  maxItems = 10,
): FilterType<T> {
  return {
    label,
    property,
    type: FilterTypes.SearcheableOptions,
    optionsProvider: createSearchableOptionsProvider(items, labelSelector),
    searchInputPlaceholder: placeholder,
    maxItems,
  };
}

export function createDateRangeFilters<T extends Data>(
  property: keyof T,
  fromLabel: string,
  toLabel: string,
  createFromValidator: (key: keyof T) => FilterValidatorFunction<T>,
  createToValidator: (key: keyof T) => FilterValidatorFunction<T>,
): FilterType<T>[] {
  return [
    {
      label: fromLabel,
      property,
      type: FilterTypes.Date,
      onValidate: createFromValidator(property),
    },
    {
      label: toLabel,
      property,
      type: FilterTypes.Date,
      onValidate: createToValidator(property),
    },
  ];
}

export function createNumericFilter<T extends Data>(
  label: string,
  property: keyof T,
): FilterType<T> {
  return {
    label,
    property,
    type: FilterTypes.Numeric,
  };
}

export function createOptionsFilter<T extends Data>(
  label: string,
  property: keyof T,
  options: { label: string; value: string | number | boolean }[],
): FilterType<T> {
  return {
    label,
    property,
    type: FilterTypes.Options,
    options,
  };
}

function createSearchableOptionsProvider<T>(
  items: T[] | undefined,
  labelSelector: (item: T) => string,
  valueSelector: (item: T) => string = labelSelector,
  maxItems = 10,
): (searchText: string) => { label: string; value: string }[] {
  return (searchText: string) => {
    const searchLower = searchText.trim().toLowerCase();
    return (
      items
        ?.filter((item) =>
          labelSelector(item).toLowerCase().includes(searchLower),
        )
        .slice(0, maxItems)
        .map((item) => ({
          label: labelSelector(item),
          value: valueSelector(item),
        })) || []
    );
  };
}
