import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterValues,
  transformRange,
} from '@axinom/mosaic-ui';
import { client } from '../../../apolloClient';
import { Constants } from '../../../constants';
import {
  PublishStatus,
  TvShowCastsFilterOptionsQuery,
  TvshowFilter,
  TvShowGenresFilterOptionsQuery,
  TvshowGenresOrderBy,
  TvShowProductionCountriesFilterOptionsQuery,
  TvshowsCastsOrderBy,
  TvshowsProductionCountriesOrderBy,
  TvshowsTagsOrderBy,
  TvShowTagsFilterOptionsQuery,
  useTvShowCastsFilterOptionsQuery,
  useTvShowGenresFilterOptionsQuery,
  useTvShowProductionCountriesFilterOptionsQuery,
  useTvShowTagsFilterOptionsQuery,
} from '../../../generated/graphql';
import {
  createDateRangeFilters,
  createNumericFilter,
  createOptionsFilter,
  createSearchableFilter,
  createTextFilter,
} from '../../../Util/FilterUtils';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { TvShowData } from './TvShowExplorer.types';

export function useTvShowsFilters(): {
  readonly filterOptions: FilterType<TvShowData>[];
  readonly transformFilters: (
    filters: FilterValues<TvShowData>,
    excludeItems?: number[],
  ) => TvshowFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<TvShowData>();

  const { genres, tags, casts, countries } = useTvShowFilterData();

  const filterOptions: FilterType<TvShowData>[] = [
    createTextFilter(Constants.TITLE, 'title'),
    createTextFilter(Constants.ORIGINAL_TITLE, 'originalTitle'),
    createTextFilter(Constants.EXTERNAL_ID, 'externalId'),
    createSearchableFilter(
      Constants.TAGS,
      'tvshowsTags',
      tags,
      (tag) => tag?.name ?? '',
      Constants.SEARCH_TAGS,
    ),
    createSearchableFilter(
      Constants.GENRE,
      'tvshowsTvshowGenres',
      genres,
      (genre) => genre?.title ?? '',
      Constants.SEARCH_GENRES,
    ),
    createSearchableFilter(
      Constants.CAST,
      'tvshowsCasts',
      casts,
      (cast) => cast?.name ?? '',
      Constants.SEARCH_CAST_MEMBERS,
    ),
    ...createDateRangeFilters(
      'released',
      Constants.RELEASE_PERIOD_FROM,
      Constants.RELEASE_PERIOD_TO,
      createFromDateFilterValidator,
      createToDateFilterValidator,
    ),
    createSearchableFilter(
      Constants.PRODUCTION_COUNTRY,
      'tvshowsProductionCountries',
      countries,
      (country) => country?.name ?? '',
      Constants.SEARCH_COUNTRIES,
    ),
    createTextFilter(Constants.STUDIO, 'studio'),

    createOptionsFilter(
      Constants.PUBLICATION_STATUS,
      'publishStatus',
      Object.values(PublishStatus).map((status) => ({
        value: status,
        label: getEnumLabel(status),
      })),
    ),
    ...createDateRangeFilters(
      'publishedDate',
      Constants.PUBLICATION_PERIOD_FROM,
      Constants.PUBLICATION_PERIOD_TO,
      createFromDateFilterValidator,
      createToDateFilterValidator,
    ),
    ...createDateRangeFilters(
      'createdDate',
      Constants.CREATION_PERIOD_FROM,
      Constants.CREATION_PERIOD_TO,
      createFromDateFilterValidator,
      createToDateFilterValidator,
    ),
    createNumericFilter(Constants.ID, 'id'),
  ];

  const transformFilters = (
    filters: FilterValues<TvShowData>,
    excludeItems?: number[],
  ): TvshowFilter | undefined => {
    return filterToPostGraphileFilter<TvshowFilter>(filters, {
      title: 'includesInsensitive',
      originalTitle: 'includesInsensitive',
      externalId: 'includesInsensitive',
      tvshowsTags: ['some', 'name', 'includesInsensitive'],
      tvshowsTvshowGenres: [
        'some',
        'tvshowGenres',
        'title',
        'includesInsensitive',
      ],
      tvshowsCasts: ['some', 'name', 'includesInsensitive'],
      tvshowsProductionCountries: ['some', 'name', 'includesInsensitive'],
      studio: 'includesInsensitive',
      publishStatus: 'in',
      id: (value) => {
        if (typeof value === 'number') {
          return {
            equalTo: value,
            notIn: excludeItems,
          };
        } else {
          return {
            notIn: excludeItems,
          };
        }
      },
      released: transformRange,
      createdDate: transformRange,
      publishedDate: transformRange,
    });
  };

  return { filterOptions, transformFilters };
}

const fetchPolicy = 'network-only';

function useTvShowFilterData(): {
  genres: NonNullable<TvShowGenresFilterOptionsQuery['tvshowGenres']>['nodes'];
  tags: NonNullable<TvShowTagsFilterOptionsQuery['tvshowsTags']>['nodes'];
  casts: NonNullable<TvShowCastsFilterOptionsQuery['tvshowsCasts']>['nodes'];
  countries: NonNullable<
    TvShowProductionCountriesFilterOptionsQuery['tvshowsProductionCountries']
  >['nodes'];
} {
  const genres = useTvShowGenresFilterOptionsQuery({
    client,
    variables: { orderBy: [TvshowGenresOrderBy.SortOrderAsc] },
    fetchPolicy,
  });

  const tags = useTvShowTagsFilterOptionsQuery({
    client,
    variables: { orderBy: [TvshowsTagsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const casts = useTvShowCastsFilterOptionsQuery({
    client,
    variables: { orderBy: [TvshowsCastsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const countries = useTvShowProductionCountriesFilterOptionsQuery({
    client,
    variables: { orderBy: [TvshowsProductionCountriesOrderBy.NameAsc] },
    fetchPolicy,
  });

  return {
    genres: genres.data?.tvshowGenres?.nodes ?? [],
    tags: tags.data?.tvshowsTags?.nodes ?? [],
    casts: casts.data?.tvshowsCasts?.nodes ?? [],
    countries: countries.data?.tvshowsProductionCountries?.nodes ?? [],
  };
}
