import {
  FilterFunction,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { PlaylistFilter, PublicationState } from '../../../generated/graphql';
import { PlaylistsData } from './Playlists.types';

/**
 * Filter for playlists that have a scheduled start in the future, or in the past.
 * @param value value selected in filter.
 * @returns postgraphile filter
 */
//todo: improve filtering logic?
const scheduledStartFilter: FilterFunction = (value) => {
  const filterValue = value as string;
  let filter: Record<string, unknown> = {};
  //today's date without the time
  const filterDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  if (filterValue === 'past') {
    filter = { lessThan: filterDate };
  } else if (filterValue === 'upcoming') {
    filter = { greaterThanOrEqualTo: filterDate };
  }
  return filter;
};

export const filterOptions: FilterType<PlaylistsData>[] = [
  {
    label: 'Past / Upcoming',
    property: 'startDateTime',
    type: FilterTypes.Options,
    options: [
      { label: 'Upcoming', value: 'upcoming' },
      { label: 'Past', value: 'past' },
    ],
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
];

export function transformFilters(
  filters: FilterValues<PlaylistsData>,
): PlaylistFilter | undefined {
  return filterToPostGraphileFilter<PlaylistFilter>(filters, {
    publicationState: 'in',
    startDateTime: scheduledStartFilter,
    createdDate: transformRange,
    updatedDate: transformRange,
  });
}
