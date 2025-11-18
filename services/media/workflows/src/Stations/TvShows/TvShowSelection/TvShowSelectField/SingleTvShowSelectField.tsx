import { FieldHookConfig } from 'formik';
import React from 'react';
import { TvShowData } from '../../TvShowExplorerBase/TvShowExplorer.types';
import { TvShowSelectField } from './TvShowSelectField';

export type SingleTvShowSelectFieldProps = Pick<
  FieldHookConfig<TvShowData>,
  'name' | 'value'
> & {
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Label to be displayed */
  label: string;
  /** onChange handler to be called when the value changes */
  onChange?: (event: { target: { name: string; value: TvShowData } }) => void;
  /** CSS class to be applied to the component */
  className?: string;
};

export const SingleTvShowSelectField: React.FC<
  SingleTvShowSelectFieldProps
> = ({ value, onChange, ...props }) => (
  <TvShowSelectField
    {...props}
    maxItems={1}
    value={value ? [value] : []}
    onChange={(e) => {
      onChange &&
        onChange({
          target: {
            name: props.name,
            value: e.target.value[0],
          },
        });
    }}
  />
);
