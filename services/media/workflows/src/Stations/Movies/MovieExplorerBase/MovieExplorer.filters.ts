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
  MovieCastsFilterOptionsQuery,
  MovieCountriesFilterOptionsQuery,
  MovieFilter,
  MovieGenresFilterOptionsQuery,
  MovieGenresOrderBy,
  MoviesCastsOrderBy,
  MoviesProductionCountriesOrderBy,
  MoviesTagsOrderBy,
  MovieTagsFilterOptionsQuery,
  PublishStatus,
  useMovieCastsFilterOptionsQuery,
  useMovieCountriesFilterOptionsQuery,
  useMovieGenresFilterOptionsQuery,
  useMovieTagsFilterOptionsQuery,
} from '../../../generated/graphql';
import {
  createDateRangeFilters,
  createNumericFilter,
  createOptionsFilter,
  createSearchableFilter,
  createTextFilter,
} from '../../../Util/FilterUtils';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { MovieData } from './MovieExplorer.types';

export function useMoviesFilters(): {
  readonly filterOptions: FilterType<MovieData>[];
  readonly transformFilters: (
    filters: FilterValues<MovieData>,
    excludeItems?: number[],
  ) => MovieFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<MovieData>();

  const { genres, tags, casts, countries } = useMovieFilterData();

  const filterOptions: FilterType<MovieData>[] = [
    createTextFilter(Constants.TITLE, 'title'),
    createTextFilter(Constants.ORIGINAL_TITLE, 'originalTitle'),
    createTextFilter(Constants.EXTERNAL_ID, 'externalId'),
    createSearchableFilter(
      Constants.TAGS,
      'moviesTags',
      tags,
      (tag) => tag?.name ?? '',
      Constants.SEARCH_TAGS,
    ),
    createSearchableFilter(
      Constants.GENRE,
      'moviesMovieGenres',
      genres,
      (genre) => genre?.title ?? '',
      Constants.SEARCH_GENRES,
    ),
    createSearchableFilter(
      Constants.CAST,
      'moviesCasts',
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
      'moviesProductionCountries',
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
    createOptionsFilter(Constants.MAIN_VIDEO, 'mainVideoId', [
      {
        label: Constants.ASSIGNED,
        value: true,
      },
      {
        label: Constants.NOT_ASSIGNED,
        value: false,
      },
    ]),
  ];

  const transformFilters = (
    filters: FilterValues<MovieData>,
    excludeItems?: number[],
  ): MovieFilter | undefined => {
    return filterToPostGraphileFilter<MovieFilter>(filters, {
      title: 'includesInsensitive',
      originalTitle: 'includesInsensitive',
      externalId: 'includesInsensitive',
      moviesTags: ['some', 'name', 'includesInsensitive'],
      moviesMovieGenres: [
        'some',
        'movieGenres',
        'title',
        'includesInsensitive',
      ],
      moviesCasts: ['some', 'name', 'includesInsensitive'],
      moviesProductionCountries: ['some', 'name', 'includesInsensitive'],
      studio: 'includesInsensitive',
      publishStatus: 'in',
      id: (value) => {
        if (typeof value === 'number') {
          // User filter
          return {
            equalTo: value,
            notIn: excludeItems,
          };
        } else {
          // Exclude items
          return {
            notIn: excludeItems,
          };
        }
      },
      released: transformRange,
      createdDate: transformRange,
      publishedDate: transformRange,
      mainVideoId: (value) => ({
        isNull: !value,
      }),
    });
  };

  return { filterOptions, transformFilters };
}

const fetchPolicy = 'network-only';

function useMovieFilterData(): {
  genres: NonNullable<MovieGenresFilterOptionsQuery['movieGenres']>['nodes'];
  tags: NonNullable<MovieTagsFilterOptionsQuery['moviesTags']>['nodes'];
  casts: NonNullable<MovieCastsFilterOptionsQuery['moviesCasts']>['nodes'];
  countries: NonNullable<
    MovieCountriesFilterOptionsQuery['moviesProductionCountries']
  >['nodes'];
} {
  const genres = useMovieGenresFilterOptionsQuery({
    client,
    variables: { orderBy: [MovieGenresOrderBy.TitleAsc] },
    fetchPolicy,
  });

  const tags = useMovieTagsFilterOptionsQuery({
    client,
    variables: { orderBy: [MoviesTagsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const casts = useMovieCastsFilterOptionsQuery({
    client,
    variables: { orderBy: [MoviesCastsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const countries = useMovieCountriesFilterOptionsQuery({
    client,
    variables: { orderBy: [MoviesProductionCountriesOrderBy.NameAsc] },
    fetchPolicy,
  });

  return {
    genres: genres.data?.movieGenres?.nodes ?? [],
    tags: tags.data?.moviesTags?.nodes ?? [],
    casts: casts.data?.moviesCasts?.nodes ?? [],
    countries: countries.data?.moviesProductionCountries?.nodes ?? [],
  };
}
