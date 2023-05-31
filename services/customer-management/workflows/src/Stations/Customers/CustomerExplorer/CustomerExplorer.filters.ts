import { FilterType, FilterTypes } from '@axinom/mosaic-ui';
import { CustomerData } from './CustomerExplorer.types';

export function CustomerFilters(): {
  readonly filterOptions: FilterType<CustomerData>[];
} {
  const filterOptions: FilterType<CustomerData>[] = [
    {
      label: 'ID',
      property: 'id',
      type: FilterTypes.FreeText,
    },
    {
      label: 'First Name',
      property: 'first_name',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Last Name',
      property: 'last_name',
      type: FilterTypes.FreeText,
    },
    {
      label: 'System',
      property: 'system',
      type: FilterTypes.Options,
      options: [
        { label: 'Internal', value: 'Internal' },
        { label: 'External', value: 'External' },
      ],
    },
    {
      label: 'Email',
      property: 'email',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Mobile',
      property: 'mobile',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Country',
      property: 'registration_country',
      type: FilterTypes.FreeText,
    },
  ];

  return { filterOptions };
}
