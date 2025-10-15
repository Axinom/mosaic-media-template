import { BulkEditEpisodesAsyncFormFieldsConfig } from '../../../../generated/graphql';
import { labelMapper, typeMapper } from '../../../../Util/BulkEdit';

export const EpisodesBulkEditConfig = (() => {
  const fields: Partial<typeof BulkEditEpisodesAsyncFormFieldsConfig.fields> = {
    ...BulkEditEpisodesAsyncFormFieldsConfig.fields,
  };

  labelMapper(fields, {
    episodesTvshowGenresAdd: 'Genre (Add)',
    episodesTvshowGenresRemove: 'Genre (Remove)',
    episodesCastsAdd: 'Cast (Add)',
    episodesCastsRemove: 'Cast (Remove)',
    episodesProductionCountriesAdd: 'Production Country (Add)',
    episodesProductionCountriesRemove: 'Production Country (Remove)',
    episodesTrailersAdd: 'Trailer (Add)',
    episodesTrailersRemove: 'Trailer (Remove)',
    episodesTagsAdd: 'Tags (Add)',
    episodesTagsRemove: 'Tags (Remove)',
    seasonId: 'Season',
    mainVideoId: 'Main Video',
  });

  typeMapper(fields, {
    episodesTrailersAdd: 'VideoSelection',
    episodesTrailersRemove: 'VideoSelection',
    seasonId: 'SeasonSelection',
  });

  delete fields['collectionRelationsAdd'];
  delete fields['collectionRelationsRemove'];
  delete fields['episodesLicensesAdd'];
  delete fields['episodesLicensesRemove'];
  delete fields['episodesSnapshotsAdd'];
  delete fields['episodesSnapshotsRemove'];
  delete fields['episodesImagesAdd'];
  delete fields['episodesImagesRemove'];
  delete fields['released'];
  delete fields['index'];

  fields['episodesCoverImagesAdd'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Add)',
    originalFieldName: 'episodesImages',
    action: BulkEditEpisodesAsyncFormFieldsConfig.keys.add,
  };

  fields['episodesCoverImagesRemove'] = {
    type: 'CoverImageSelection',
    label: 'Cover Image (Remove)',
    originalFieldName: 'episodesImages',
    action: BulkEditEpisodesAsyncFormFieldsConfig.keys.remove,
  };

  fields['episodesTeaserImagesAdd'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Add)',
    originalFieldName: 'episodesImages',
    action: BulkEditEpisodesAsyncFormFieldsConfig.keys.add,
  };

  fields['episodesTeaserImagesRemove'] = {
    type: 'TeaserImageSelection',
    label: 'Teaser Image (Remove)',
    originalFieldName: 'episodesImages',
    action: BulkEditEpisodesAsyncFormFieldsConfig.keys.remove,
  };

  return {
    ...BulkEditEpisodesAsyncFormFieldsConfig,
    fields,
  };
})();
