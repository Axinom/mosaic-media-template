import {
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { ChannelFilter, PublicationState } from '../../../generated/graphql';
import { ChannelsData } from './Channels.types';

export const filterOptions: FilterType<ChannelsData>[] = [
  {
    label: 'Title',
    property: 'title',
    type: FilterTypes.FreeText,
  },
  {
    label: 'Creation Period (From)',
    property: 'createdDate',
    type: FilterTypes.DateTime,
  },
  {
    label: 'Creation Period (To)',
    property: 'createdDate',
    type: FilterTypes.DateTime,
  },
  {
    label: 'Modification Period (From)',
    property: 'updatedDate',
    type: FilterTypes.DateTime,
  },
  {
    label: 'Modification Period (To)',
    property: 'updatedDate',
    type: FilterTypes.DateTime,
  },
  {
    label: 'Publication State',
    property: 'publicationState',
    type: FilterTypes.Options,
    options: [
      {
        label: 'Published',
        value: PublicationState.Published,
      },
      {
        label: 'Changed',
        value: PublicationState.Changed,
      },
      {
        label: 'Not Published',
        value: PublicationState.NotPublished,
      },
    ],
  },
  {
    label: 'Publication Period (From)',
    property: 'publishedDate',
    type: FilterTypes.DateTime,
  },
  {
    label: 'Publication Period (To)',
    property: 'publishedDate',
    type: FilterTypes.DateTime,
  },
];

export function transformFilters(
  filters: FilterValues<ChannelsData>,
): ChannelFilter | undefined {
  return filterToPostGraphileFilter<ChannelFilter>(filters, {
    title: 'includesInsensitive',
    publicationState: 'in',
    createdDate: transformRange,
    updatedDate: transformRange,
    publishedDate: transformRange,
  });
}
