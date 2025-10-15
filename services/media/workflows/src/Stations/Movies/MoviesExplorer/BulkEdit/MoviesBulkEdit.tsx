import {
  BulkEditFormFieldsConfigConverter,
  defaultComponentMap,
} from '@axinom/mosaic-ui';
import React from 'react';
import { MovieImageType } from '../../../../generated/graphql';
import {
  getBulkEditImageSelectField,
  getVideoSelectField,
  MainVideoSelectionField,
} from '../../../../Util/BulkEdit';
import { MovieGenreSelectField } from './MovieGenreSelectField';
import { MoviesBulkEditConfig } from './MoviesBulkEditConfig';

export const MoviesBulkEdit: React.FC = () => {
  const componentMap = {
    ...defaultComponentMap,
    CoverImageSelection: getBulkEditImageSelectField(
      MovieImageType.Cover,
      'movie',
      1,
    ),
    TeaserImageSelection: getBulkEditImageSelectField(
      MovieImageType.Teaser,
      'movie',
      1,
    ),
    VideoSelection: getVideoSelectField('TRAILER'),
    UUID: MainVideoSelectionField,
    MovieGenreSelection: MovieGenreSelectField,
  };

  const fields = MoviesBulkEditConfig.fields;

  return BulkEditFormFieldsConfigConverter(
    Object.keys(fields)
      .sort()
      .reduce((acc, key) => {
        acc[key] = fields[key];
        return acc;
      }, {}),
    componentMap,
  );
};
