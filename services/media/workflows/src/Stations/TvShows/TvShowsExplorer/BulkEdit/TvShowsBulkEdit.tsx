import {
  BulkEditFormFieldsConfigConverter,
  defaultComponentMap,
} from '@axinom/mosaic-ui';
import React from 'react';
import { TvshowImageType } from '../../../../generated/graphql';
import {
  getBulkEditImageSelectField,
  getVideoSelectField,
} from '../../../../Util/BulkEdit';
import { BulkEditTvShowGenreSelectField } from './TvShowGenreSelectField';
import { TvShowsBulkEditConfig } from './TvShowsBulkEditConfig';

export const TvShowsBulkEdit: React.FC = () => {
  const componentMap = {
    ...defaultComponentMap,
    CoverImageSelection: getBulkEditImageSelectField(
      TvshowImageType.Cover,
      'tvshow',
      1,
    ),
    TeaserImageSelection: getBulkEditImageSelectField(
      TvshowImageType.Teaser,
      'tvshow',
      1,
    ),
    VideoSelection: getVideoSelectField('TRAILER'),
    TvShowGenreSelection: BulkEditTvShowGenreSelectField,
  };

  const fields = TvShowsBulkEditConfig.fields;

  return BulkEditFormFieldsConfigConverter(
    Object.entries(fields)
      .sort(([, a], [, b]) => (a.label || '').localeCompare(b.label || ''))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}),
    componentMap,
  );
};
