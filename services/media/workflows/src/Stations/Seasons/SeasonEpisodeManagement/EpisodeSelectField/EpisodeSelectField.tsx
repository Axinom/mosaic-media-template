import { GenericField } from '@axinom/mosaic-ui';
import { FieldHookConfig, useField } from 'formik';
import React from 'react';
import { EpisodeDataList } from '../EpisodeDataList/EpisodeDataList';
import { SeasonEpisode } from '../SeasonEpisodeManagement.types';

type EpisodeSelectFieldProps = FieldHookConfig<SeasonEpisode[]> & {
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Label to be displayed */
  label: string;
};

export const EpisodeSelectField: React.FC<EpisodeSelectFieldProps> = (
  props,
) => {
  const [field, , helpers] = useField(props);

  return (
    <>
      <GenericField label={props.label} name={field.name}>
        <EpisodeDataList
          maxItems={props.maxItems}
          value={field.value}
          onChange={(value) => helpers.setValue(value)}
        />
      </GenericField>
    </>
  );
};
