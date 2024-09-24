import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import { MovieRelatedCollections } from '../CollectionEntityManagement.types';
import { EntityDataList } from './EntityDataList';

export const EntitySelectField: React.FC<
  FieldHookConfig<MovieRelatedCollections[]>
> = (props) => {
  const [field, , helpers] = useField(props);

  return (
    <>
      <EntityDataList
        value={field.value}
        onChange={(values) => helpers.setValue(values)}
      />
    </>
  );
};
