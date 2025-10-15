import { BulkEditMoviesAsyncFormFieldsConfig } from '../../../../generated/graphql';
import { labelMapper, typeMapper } from '../../../../Util/BulkEdit';

export const MoviesBulkEditConfig = (() => {
  const fields: Partial<typeof BulkEditMoviesAsyncFormFieldsConfig.fields> = {
    ...BulkEditMoviesAsyncFormFieldsConfig.fields,
  };

  labelMapper(fields, {
    moviesMovieGenresAdd: 'Genres (Add)',
    moviesMovieGenresRemove: 'Genres (Remove)',
    moviesCastsAdd: 'Cast (Add)',
    moviesCastsRemove: 'Cast (Remove)',
    moviesProductionCountriesAdd: 'Production Country (Add)',
    moviesProductionCountriesRemove: 'Production Country (Remove)',
    moviesTrailersAdd: 'Trailer (Add)',
    moviesTrailersRemove: 'Trailer (Remove)',
    mainVideoId: 'Main Video',
    moviesTagsAdd: 'Tags (Add)',
    moviesTagsRemove: 'Tags (Remove)',
  });

  typeMapper(fields, {
    moviesTrailersAdd: 'VideoSelection',
    moviesTrailersRemove: 'VideoSelection',
    moviesMovieGenresAdd: 'MovieGenreSelection',
    moviesMovieGenresRemove: 'MovieGenreSelection',
  });

  delete fields['collectionRelationsAdd'];
  delete fields['collectionRelationsRemove'];
  delete fields['moviesLicensesAdd'];
  delete fields['moviesLicensesRemove'];
  delete fields['moviesSnapshotsAdd'];
  delete fields['moviesSnapshotsRemove'];
  delete fields['moviesImagesAdd'];
  delete fields['moviesImagesRemove'];
  delete fields['released'];

  fields['moviesCoverImagesAdd'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Add)',
    originalFieldName: 'moviesImages',
    action: BulkEditMoviesAsyncFormFieldsConfig.keys.add,
  };

  fields['moviesCoverImagesRemove'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Remove)',
    originalFieldName: 'moviesImages',
    action: BulkEditMoviesAsyncFormFieldsConfig.keys.remove,
  };

  fields['moviesTeaserImagesAdd'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Add)',
    originalFieldName: 'moviesImages',
    action: BulkEditMoviesAsyncFormFieldsConfig.keys.add,
  };

  fields['moviesTeaserImagesRemove'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Remove)',
    originalFieldName: 'moviesImages',
    action: BulkEditMoviesAsyncFormFieldsConfig.keys.remove,
  };

  return {
    ...BulkEditMoviesAsyncFormFieldsConfig,
    fields,
  };
})();
