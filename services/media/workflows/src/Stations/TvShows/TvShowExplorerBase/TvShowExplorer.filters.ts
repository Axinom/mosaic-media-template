import {
  createDateRangeFilterValidators,
  filterToPostGraphileFilter,
  FilterType,
  FilterTypes,
  FilterValues,
  Option,
  transformRange,
} from '@axinom/mosaic-ui';
import { useEffect, useState } from 'react';
import { client } from '../../../apolloClient';
import {
  BusinessType,
  PublishStatus,
  TvshowFilter,
  useGetAllOptionsDataQuery,
} from '../../../generated/graphql';
import { getEnumLabel } from '../../../Util/StringEnumMapper/StringEnumMapper';
import { TvShowData } from './TvShowExplorer.types';

interface allOptions {
  allAgeRatings: Option[];
  allContentOwners: Option[];
}

export function useTvShowsFilters(): {
  readonly filterOptions: FilterType<TvShowData>[];
  readonly transformFilters: (
    filters: FilterValues<TvShowData>,
    excludeItems?: number[],
  ) => TvshowFilter | undefined;
} {
  const [AllFilterOptions, setAllFilterOptions] = useState<allOptions>({
    allAgeRatings: [],
    allContentOwners: [],
  });

  const { data, error } = useGetAllOptionsDataQuery({ client });

  useEffect(() => {
    if (error) {
      setAllFilterOptions({
        allAgeRatings: [
          {
            label: 'Unable to load age rating options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
        allContentOwners: [
          {
            label: 'Unable to load content owner options data.',
            value: 'FAILED_TO_LOAD_ERROR',
          },
        ],
      });
    } else {
      let ageRating: Option[] = [];
      let contentOwner: Option[] = [];
      if (data?.ageRatings?.nodes !== undefined) {
        ageRating = data.ageRatings.nodes.map(({ name }) => ({
          label: name,
          value: name,
        }));
      }
      if (data?.contentOwners?.nodes !== undefined) {
        contentOwner = data.contentOwners.nodes.map(({ name }) => ({
          label: name,
          value: name,
        }));
      }
      setAllFilterOptions({
        allAgeRatings: ageRating,
        allContentOwners: contentOwner,
      });
    }
  }, [data]);

  const [createFromDateFilterValidator, createToDateFilterValidator] =
    createDateRangeFilterValidators<TvShowData>();

  const filterOptions: FilterType<TvShowData>[] = [
    {
      label: 'Title',
      property: 'title',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Genre',
      property: 'tvshowsTvshowGenres',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Tags',
      property: 'tvshowsTags',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Content Owners',
      property: 'contentOwner',
      type: FilterTypes.Options,
      options: AllFilterOptions.allContentOwners,
    },
    {
      label: 'Age Ratings',
      property: 'ageRating',
      type: FilterTypes.Options,
      options: AllFilterOptions.allAgeRatings,
    },
    {
      label: 'Publishing Status',
      property: 'publishStatus',
      type: FilterTypes.Options,
      options: Object.keys(PublishStatus).map((key) => ({
        value: PublishStatus[key],
        label: getEnumLabel(PublishStatus[key]),
      })),
    },
    {
      label: 'Audio Languages',
      property: 'audioLanguages',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Cast',
      property: 'tvshowsCasts',
      type: FilterTypes.FreeText,
    },
    {
      label: 'License Countries',
      property: 'tvshowsProductionCountries',
      type: FilterTypes.FreeText,
    },
    {
      label: 'TV Show Valid Licensing',
      property: 'tvshowsLicenses',
      options: [
        { value: 'Valid license', label: 'Valid license' },
        { value: 'No valid license', label: 'No valid license' },
      ],
      type: FilterTypes.Options,
    },
    {
      label: 'Episode Valid Licensing',
      property: 'seasons',
      options: [
        { value: 'Valid license', label: 'Valid license' },
        { value: 'No valid license', label: 'No valid license' },
      ],
      type: FilterTypes.Options,
    },
    {
      label: 'External ID',
      property: 'externalId',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Business Type',
      property: 'businessType',
      type: FilterTypes.Options,
      options: Object.keys(BusinessType).map((key) => ({
        value: BusinessType[key],
        label: getEnumLabel(BusinessType[key]),
      })),
    },
    {
      label: 'Episode Subtype',
      property: 'seasons',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Release Period (From)',
      property: 'released',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('released'),
    },
    {
      label: 'Release Period (To)',
      property: 'released',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('released'),
    },
    {
      label: 'Production Country',
      property: 'tvshowsProductionCountries',
      type: FilterTypes.FreeText,
    },
    {
      label: 'Studio',
      property: 'studio',
      type: FilterTypes.FreeText,
    },

    {
      label: 'Publication Period (From)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('publishedDate'),
    },
    {
      label: 'Publication Period (To)',
      property: 'publishedDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('publishedDate'),
    },
    {
      label: 'Creation Period (From)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createFromDateFilterValidator('createdDate'),
    },
    {
      label: 'Creation Period (To)',
      property: 'createdDate',
      type: FilterTypes.Date,
      onValidate: createToDateFilterValidator('createdDate'),
    },
    {
      label: 'ID',
      property: 'id',
      type: FilterTypes.Numeric,
    },
  ];

  const transformFilters = (
    filters: FilterValues<TvShowData>,
    excludeItems?: number[],
  ): TvshowFilter | undefined => {
    return filterToPostGraphileFilter<TvshowFilter>(filters, {
      title: 'includesInsensitive',
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
      ageRating: 'includesInsensitive',
      audioLanguages: 'equalTo',
      contentOwner: 'includesInsensitive',
      tvshowsLicenses: (value) => {
        if (value === 'Valid license') {
          return {
            some: {
              licenseEnd: {
                greaterThan: new Date(),
              },
            },
          };
        } else {
          return {
            every: {
              licenseEnd: {
                lessThanOrEqualTo: new Date(),
              },
            },
          };
        }
      },
      seasons: (value: any) => {
        if (value[0] === 'Valid license') {
          return {
            some: {
              episodes: {
                some: {
                  episodesLicenses: {
                    some: {
                      licenseEnd: {
                        greaterThan: new Date(),
                      },
                    },
                  },
                },
              },
            },
          };
        } else if (value[0] === 'No valid license') {
          return {
            every: {
              episodes: {
                every: {
                  episodesLicenses: {
                    every: {
                      licenseEnd: {
                        lessThanOrEqualTo: new Date(),
                      },
                    },
                  },
                },
              },
            },
          };
        } else {
          return {
            some: {
              episodes: {
                some: {
                  assetSubtype: {
                    in: value[1],
                  },
                },
              },
            },
          };
        }
      },
      assetSubtype: 'equalTo',
      businessType: 'in',
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
    });
  };

  return { filterOptions, transformFilters };
}
