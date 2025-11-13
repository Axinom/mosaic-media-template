import { GenericField } from '@axinom/mosaic-ui';
import { FieldHookConfig } from 'formik';
import React from 'react';
import { TvShowData } from '../../TvShowExplorerBase/TvShowExplorer.types';
import { TvShowDataList } from '../TvShowDataList/TvShowDataList';

export type TvShowSelectFieldProps = Pick<
  FieldHookConfig<TvShowData[]>,
  'name' | 'value'
> & {
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Label to be displayed */
  label: string;
  /** onChange handler to be called when the value changes */
  onChange?: (event: { target: { name: string; value: TvShowData[] } }) => void;
  /** CSS class to be applied to the component */
  className?: string;
};

export const TvShowSelectField: React.FC<TvShowSelectFieldProps> = (props) => {
  return (
    <>
      <GenericField label={props.label} name={props.name}>
        <TvShowDataList
          maxItems={props.maxItems}
          value={props.value}
          className={props.className}
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
