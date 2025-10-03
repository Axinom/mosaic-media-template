import {
  BulkEditFormFieldsConfigConverter,
  defaultComponentMap,
} from '@axinom/mosaic-ui';
import React from 'react';
import { SeasonImageType } from '../../../../generated/graphql';
import {
  getBulkEditImageSelectField,
  getVideoSelectField,
} from '../../../../Util/BulkEdit';
import { SeasonsBulkEditConfig } from './SeasonsBulkEditConfig';
import { BulkEditTvShowSelectionField } from './TvShowSelectField';

export const SeasonsBulkEdit: React.FC = () => {
  const componentMap = {
    ...defaultComponentMap,
    CoverImageSelection: getBulkEditImageSelectField(
      SeasonImageType.Cover,
      'season',
      1,
    ),
    TeaserImageSelection: getBulkEditImageSelectField(
      SeasonImageType.Teaser,
      'season',
      1,
    ),
    VideoSelection: getVideoSelectField('TRAILER'),
    TvShowSelection: BulkEditTvShowSelectionField,
  };

  const fields = SeasonsBulkEditConfig.fields;

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
