import { BulkEditSeasonsAsyncFormFieldsConfig } from '../../../../generated/graphql';
import { labelMapper, typeMapper } from '../../../../Util/BulkEdit';

export const SeasonsBulkEditConfig = (() => {
  const fields: Partial<typeof BulkEditSeasonsAsyncFormFieldsConfig.fields> = {
    ...BulkEditSeasonsAsyncFormFieldsConfig.fields,
  };

  labelMapper(fields, {
    seasonsTvshowGenresAdd: 'Genre (Add)',
    seasonsTvshowGenresRemove: 'Genre (Remove)',
    seasonsCastsAdd: 'Cast (Add)',
    seasonsCastsRemove: 'Cast (Remove)',
    seasonsProductionCountriesAdd: 'Production Country (Add)',
    seasonsProductionCountriesRemove: 'Production Country (Remove)',
    seasonsTrailersAdd: 'Trailer (Add)',
    seasonsTrailersRemove: 'Trailer (Remove)',
    seasonsTagsAdd: 'Tags (Add)',
    seasonsTagsRemove: 'Tags (Remove)',
    tvshowId: 'TV Show',
  });

  typeMapper(fields, {
    seasonsTrailersAdd: 'VideoSelection',
    seasonsTrailersRemove: 'VideoSelection',
    tvshowId: 'TvShowSelection',
  });

  delete fields['collectionRelationsAdd'];
  delete fields['collectionRelationsRemove'];
  delete fields['seasonsLicensesAdd'];
  delete fields['seasonsLicensesRemove'];
  delete fields['seasonsSnapshotsAdd'];
  delete fields['seasonsSnapshotsRemove'];
  delete fields['seasonsImagesAdd'];
  delete fields['seasonsImagesRemove'];
  delete fields['released'];
  delete fields['episodesAdd'];
  delete fields['episodesRemove'];

  fields['seasonsCoverImagesAdd'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Add)',
    originalFieldName: 'seasonsImages',
    action: BulkEditSeasonsAsyncFormFieldsConfig.keys.add,
  };

  fields['seasonsCoverImagesRemove'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Remove)',
    originalFieldName: 'seasonsImages',
    action: BulkEditSeasonsAsyncFormFieldsConfig.keys.remove,
  };

  fields['seasonsTeaserImagesAdd'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Add)',
    originalFieldName: 'seasonsImages',
    action: BulkEditSeasonsAsyncFormFieldsConfig.keys.add,
  };

  fields['seasonsTeaserImagesRemove'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Remove)',
    originalFieldName: 'seasonsImages',
    action: BulkEditSeasonsAsyncFormFieldsConfig.keys.remove,
  };

  return {
    ...BulkEditSeasonsAsyncFormFieldsConfig,
    fields,
  };
})();
