import {
  BulkEditFormFieldsConfigConverter,
  defaultComponentMap,
} from '@axinom/mosaic-ui';
import React from 'react';
import { CollectionImageType } from '../../../../generated/graphql';
import { getBulkEditImageSelectField } from '../../../../Util/BulkEdit';
import { CollectionsBulkEditConfig } from './CollectionsBulkEditConfig';
import { BulkEditEntitySelectField } from './EntitySelectField';

export const CollectionsBulkEdit: React.FC = () => {
  const componentMap = {
    ...defaultComponentMap,
    CoverImageSelection: getBulkEditImageSelectField(
      CollectionImageType.Cover,
      'collection',
      1,
    ),
    EntitySelection: BulkEditEntitySelectField,
  };

  const fields = CollectionsBulkEditConfig.fields;

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
