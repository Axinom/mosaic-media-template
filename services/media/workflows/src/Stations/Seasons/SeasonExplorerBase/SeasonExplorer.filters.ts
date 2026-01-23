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
  SeasonFilter,
  SeasonsCastsFilterOptionsQuery,
  SeasonsCastsOrderBy,
  SeasonsProductionCountriesFilterOptionsQuery,
  SeasonsProductionCountriesOrderBy,
  SeasonsTagsFilterOptionsQuery,
  SeasonsTagsOrderBy,
  TvShowGenresFilterOptionsQuery,
  TvshowGenresOrderBy,
  useSeasonsCastsFilterOptionsQuery,
  useSeasonsProductionCountriesFilterOptionsQuery,
  useSeasonsTagsFilterOptionsQuery,
  useTvShowGenresFilterOptionsQuery,
} from '../../../generated/graphql';
import {
  createDateRangeFilters,
  createNumericFilter,
  createOptionsFilter,
  createSearchableFilter,
  createTextFilter,
} from '../../../Util/FilterUtils';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { SeasonData } from './SeasonExplorer.types';

export function useSeasonsFilters(): {
  readonly filterOptions: FilterType<SeasonData>[];
  readonly transformFilters: (
    filters: FilterValues<SeasonData>,
    excludeItems?: number[],
  ) => SeasonFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<SeasonData>();

  const { genres, tags, casts, countries } = useSeasonFilterData();

  const filterOptions: FilterType<
    SeasonData & {
      tvshowExists?: boolean;
    }
  >[] = [
    createNumericFilter(Constants.SEASON_INDEX, 'index'),
    createOptionsFilter(Constants.PARENT_ENTITY, 'tvshowExists', [
      {
        label: Constants.TRUE,
        value: true,
      },
      {
        label: Constants.FALSE,
        value: false,
      },
    ]),
    createTextFilter(Constants.EXTERNAL_ID, 'externalId'),
    createSearchableFilter(
      Constants.TAGS,
      'seasonsTags',
      tags,
      (tag) => tag?.name ?? '',
      'Search tags',
    ),
    createSearchableFilter(
      Constants.GENRE,
      'seasonsTvshowGenres',
      genres,
      (genre) => genre?.title ?? '',
      'Search genres',
    ),
    createSearchableFilter(
      Constants.CAST,
      'seasonsCasts',
      casts,
      (cast) => cast?.name ?? '',
      'Search cast members',
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
      'seasonsProductionCountries',
      countries,
      (country) => country?.name ?? '',
      'Search countries',
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
    filters: FilterValues<SeasonData>,
    excludeItems?: number[],
  ): SeasonFilter | undefined => {
    return filterToPostGraphileFilter<SeasonFilter>(filters, {
      index: 'equalTo',
      externalId: 'includesInsensitive',
      seasonsTags: ['some', 'name', 'includesInsensitive'],
      seasonsTvshowGenres: [
        'some',
        'tvshowGenres',
        'title',
        'includesInsensitive',
      ],
      seasonsCasts: ['some', 'name', 'includesInsensitive'],
      seasonsProductionCountries: ['some', 'name', 'includesInsensitive'],
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
      tvshowExists: (value) => value as boolean,
    });
  };

  return { filterOptions, transformFilters };
}

const fetchPolicy = 'network-only';

function useSeasonFilterData(): {
  genres: NonNullable<TvShowGenresFilterOptionsQuery['tvshowGenres']>['nodes'];
  tags: NonNullable<SeasonsTagsFilterOptionsQuery['seasonsTags']>['nodes'];
  casts: NonNullable<SeasonsCastsFilterOptionsQuery['seasonsCasts']>['nodes'];
  countries: NonNullable<
    SeasonsProductionCountriesFilterOptionsQuery['seasonsProductionCountries']
  >['nodes'];
} {
  const genres = useTvShowGenresFilterOptionsQuery({
    client,
    variables: { orderBy: [TvshowGenresOrderBy.SortOrderAsc] },
    fetchPolicy,
  });

  const tags = useSeasonsTagsFilterOptionsQuery({
    client,
    variables: { orderBy: [SeasonsTagsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const casts = useSeasonsCastsFilterOptionsQuery({
    client,
    variables: { orderBy: [SeasonsCastsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const countries = useSeasonsProductionCountriesFilterOptionsQuery({
    client,
    variables: { orderBy: [SeasonsProductionCountriesOrderBy.NameAsc] },
    fetchPolicy,
  });

  return {
    genres: genres.data?.tvshowGenres?.nodes ?? [],
    tags: tags.data?.seasonsTags?.nodes ?? [],
    casts: casts.data?.seasonsCasts?.nodes ?? [],
    countries: countries.data?.seasonsProductionCountries?.nodes ?? [],
  };
}
