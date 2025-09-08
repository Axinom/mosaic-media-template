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
  EpisodeFilter,
  EpisodesCastsFilterOptionsQuery,
  EpisodesCastsOrderBy,
  EpisodesProductionCountriesFilterOptionsQuery,
  EpisodesProductionCountriesOrderBy,
  EpisodesTagsFilterOptionsQuery,
  EpisodesTagsOrderBy,
  EpisodesTvshowGenresFilterOptionsQuery,
  EpisodesTvshowGenresOrderBy,
  PublishStatus,
  useEpisodesCastsFilterOptionsQuery,
  useEpisodesProductionCountriesFilterOptionsQuery,
  useEpisodesTagsFilterOptionsQuery,
  useEpisodesTvshowGenresFilterOptionsQuery,
} from '../../../generated/graphql';
import {
  createDateRangeFilters,
  createNumericFilter,
  createOptionsFilter,
  createSearchableFilter,
  createTextFilter,
} from '../../../Util/FilterUtils';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { EpisodeData } from './EpisodeExplorer.types';

export function useEpisodesFilters(): {
  readonly filterOptions: FilterType<EpisodeData>[];
  readonly transformFilters: (
    filters: FilterValues<EpisodeData>,
    excludeItems?: number[],
  ) => EpisodeFilter | undefined;
} {
  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<EpisodeData>();

  const { genres, tags, casts, countries } = useEpisodeFilterData();

  const filterOptions: FilterType<
    EpisodeData & {
      seasonExists?: boolean;
    }
  >[] = [
    createTextFilter(Constants.TITLE, 'title'),
    createNumericFilter(Constants.EPISODE_INDEX, 'index'),
    createOptionsFilter(Constants.PARENT_ENTITY, 'seasonExists', [
      {
        label: Constants.TRUE,
        value: true,
      },
      {
        label: Constants.FALSE,
        value: false,
      },
    ]),
    createTextFilter(Constants.ORIGINAL_TITLE, 'originalTitle'),
    createTextFilter(Constants.EXTERNAL_ID, 'externalId'),
    createSearchableFilter(
      Constants.TAGS,
      'episodesTags',
      tags,
      (tag) => tag?.name ?? '',
      Constants.SEARCH_TAGS,
    ),
    createSearchableFilter(
      Constants.GENRE,
      'episodesTvshowGenres',
      genres,
      (genre) => genre?.title ?? '',
      Constants.SEARCH_GENRES,
    ),
    createSearchableFilter(
      Constants.CAST,
      'episodesCasts',
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
      'episodesProductionCountries',
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
    filters: FilterValues<EpisodeData>,
    excludeItems?: number[],
  ): EpisodeFilter | undefined => {
    return filterToPostGraphileFilter<EpisodeFilter>(filters, {
      title: 'includesInsensitive',
      index: 'equalTo',
      originalTitle: 'includesInsensitive',
      externalId: 'includesInsensitive',
      episodesTags: ['some', 'name', 'includesInsensitive'],
      episodesTvshowGenres: [
        'some',
        'tvshowGenres',
        'title',
        'includesInsensitive',
      ],
      episodesCasts: ['some', 'name', 'includesInsensitive'],
      episodesProductionCountries: ['some', 'name', 'includesInsensitive'],
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
      mainVideoId: (value) => ({
        isNull: !value,
      }),
      seasonExists: (value) => value as boolean,
    });
  };

  return { filterOptions, transformFilters };
}

const fetchPolicy = 'network-only';

function useEpisodeFilterData(): {
  genres: NonNullable<
    EpisodesTvshowGenresFilterOptionsQuery['episodesTvshowGenres']
  >['nodes'][number]['tvshowGenres'][];
  tags: NonNullable<EpisodesTagsFilterOptionsQuery['episodesTags']>['nodes'];
  casts: NonNullable<EpisodesCastsFilterOptionsQuery['episodesCasts']>['nodes'];
  countries: NonNullable<
    EpisodesProductionCountriesFilterOptionsQuery['episodesProductionCountries']
  >['nodes'];
} {
  const genres = useEpisodesTvshowGenresFilterOptionsQuery({
    client,
    variables: { orderBy: [EpisodesTvshowGenresOrderBy.Natural] },
    fetchPolicy,
  });

  const tags = useEpisodesTagsFilterOptionsQuery({
    client,
    variables: { orderBy: [EpisodesTagsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const casts = useEpisodesCastsFilterOptionsQuery({
    client,
    variables: { orderBy: [EpisodesCastsOrderBy.NameAsc] },
    fetchPolicy,
  });

  const countries = useEpisodesProductionCountriesFilterOptionsQuery({
    client,
    variables: { orderBy: [EpisodesProductionCountriesOrderBy.NameAsc] },
    fetchPolicy,
  });

  return {
    genres:
      genres.data?.episodesTvshowGenres?.nodes
        ?.map((node) => node.tvshowGenres)
        .filter(Boolean) ?? [],
    tags: tags.data?.episodesTags?.nodes ?? [],
    casts: casts.data?.episodesCasts?.nodes ?? [],
    countries: countries.data?.episodesProductionCountries?.nodes ?? [],
  };
}
