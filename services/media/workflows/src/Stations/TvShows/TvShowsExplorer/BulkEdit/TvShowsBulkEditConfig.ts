import { BulkEditTvShowsAsyncFormFieldsConfig } from '../../../../generated/graphql';
import { labelMapper, typeMapper } from '../../../../Util/BulkEdit';

export const TvShowsBulkEditConfig = (() => {
  const fields: Partial<typeof BulkEditTvShowsAsyncFormFieldsConfig.fields> = {
    ...BulkEditTvShowsAsyncFormFieldsConfig.fields,
  };

  labelMapper(fields, {
    tvshowsTvshowGenresAdd: 'Genres (Add)',
    tvshowsTvshowGenresRemove: 'Genres (Remove)',
    tvshowsCastsAdd: 'Cast (Add)',
    tvshowsCastsRemove: 'Cast (Remove)',
    tvshowsProductionCountriesAdd: 'Production Country (Add)',
    tvshowsProductionCountriesRemove: 'Production Country (Remove)',
    tvshowsTrailersAdd: 'Trailer (Add)',
    tvshowsTrailersRemove: 'Trailer (Remove)',
    tvshowsTagsAdd: 'Tags (Add)',
    tvshowsTagsRemove: 'Tags (Remove)',
  });

  typeMapper(fields, {
    tvshowsTrailersAdd: 'VideoSelection',
    tvshowsTrailersRemove: 'VideoSelection',
    tvshowsTvshowGenresAdd: 'TvShowGenreSelection',
    tvshowsTvshowGenresRemove: 'TvShowGenreSelection',
  });

  delete fields['collectionRelationsAdd'];
  delete fields['collectionRelationsRemove'];
  delete fields['tvshowsLicensesAdd'];
  delete fields['tvshowsLicensesRemove'];
  delete fields['tvshowsSnapshotsAdd'];
  delete fields['tvshowsSnapshotsRemove'];
  delete fields['tvshowsImagesAdd'];
  delete fields['tvshowsImagesRemove'];
  delete fields['released'];
  delete fields['seasonsAdd'];
  delete fields['seasonsRemove'];

  fields['tvshowsCoverImagesAdd'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Add)',
    originalFieldName: 'tvshowsImages',
    action: BulkEditTvShowsAsyncFormFieldsConfig.keys.add,
  };

  fields['tvshowsCoverImagesRemove'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Remove)',
    originalFieldName: 'tvshowsImages',
    action: BulkEditTvShowsAsyncFormFieldsConfig.keys.remove,
  };

  fields['tvshowsTeaserImagesAdd'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Add)',
    originalFieldName: 'tvshowsImages',
    action: BulkEditTvShowsAsyncFormFieldsConfig.keys.add,
  };

  fields['tvshowsTeaserImagesRemove'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Remove)',
    originalFieldName: 'tvshowsImages',
    action: BulkEditTvShowsAsyncFormFieldsConfig.keys.remove,
  };

  return {
    ...BulkEditTvShowsAsyncFormFieldsConfig,
    fields,
  };
})();
