import { GenericField } from '@axinom/mosaic-ui';
import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import { SeasonDataList } from '../SeasonDataList/SeasonDataList';
import { TvShowSeason } from '../TvShowSeasonManagement.types';

type SeasonSelectFieldProps = FieldHookConfig<TvShowSeason[]> & {
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Label to be displayed */
  label: string;
};

export const SeasonSelectField: React.FC<SeasonSelectFieldProps> = (props) => {
  const [field, , helpers] = useField(props);

  return (
    <>
      <GenericField label={props.label} name={props.name}>
        <SeasonDataList
          maxItems={props.maxItems}
          value={field.value}
          onChange={(value) => helpers.setValue(value)}
        />
      </GenericField>
    </>
  );
};
