import {
  BulkEditFormFieldsConfigConverter,
  defaultComponentMap,
} from '@axinom/mosaic-ui';
import React from 'react';
import { EpisodeImageType } from '../../../../generated/graphql';
import {
  getBulkEditImageSelectField,
  getVideoSelectField,
  MainVideoSelectionField,
} from '../../../../Util/BulkEdit';
import { EpisodesBulkEditConfig } from './EpisodesBulkEditConfig';
import { BulkEditSeasonSelectionField } from './SeasonSelectField';

export const EpisodesBulkEdit: React.FC = () => {
  const componentMap = {
    ...defaultComponentMap,
    CoverImageSelection: getBulkEditImageSelectField(
      EpisodeImageType.Cover,
      'episode',
      1,
    ),
    TeaserImageSelection: getBulkEditImageSelectField(
      EpisodeImageType.Teaser,
      'episode',
      1,
    ),
    VideoSelection: getVideoSelectField('TRAILER'),
    SeasonSelection: BulkEditSeasonSelectionField,
    UUID: MainVideoSelectionField,
  };

  const fields = EpisodesBulkEditConfig.fields;

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
