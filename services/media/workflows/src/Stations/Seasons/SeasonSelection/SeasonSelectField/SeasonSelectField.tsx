import { GenericField } from '@axinom/mosaic-ui';
import { FieldHookConfig } from 'formik';
import React from 'react';
import { SeasonData } from '../../SeasonExplorerBase/SeasonExplorer.types';
import { SeasonDataList } from '../SeasonDataList/SeasonDataList';

export type SeasonSelectFieldProps = Pick<
  FieldHookConfig<SeasonData[]>,
  'name' | 'value'
> & {
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Label to be displayed */
  label: string;
  /** onChange handler to be called when the value changes */
  onChange?: (event: { target: { name: string; value: SeasonData[] } }) => void;
};

export const SeasonSelectField: React.FC<SeasonSelectFieldProps> = (props) => {
  return (
    <>
      <GenericField label={props.label} name={props.name}>
        <SeasonDataList
          maxItems={props.maxItems}
          value={props.value}
          onChange={(value) => {
            if (props.onChange) {
              // Call the onChange handler passed via props, mimicking Formik's event signature
              props.onChange({
                target: {
                  name: props.name,
                  value,
                },
              });
            }
          }}
        />
      </GenericField>
    </>
  );
};
