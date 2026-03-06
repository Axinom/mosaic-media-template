import { FieldHookConfig } from 'formik';
import React from 'react';
import { SeasonData } from '../../SeasonExplorerBase/SeasonExplorer.types';
import { SeasonSelectField } from './SeasonSelectField';

export type SingleSeasonSelectFieldProps = Pick<
  FieldHookConfig<SeasonData>,
  'name' | 'value'
> & {
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Label to be displayed */
  label: string;
  /** onChange handler to be called when the value changes */
  onChange?: (event: { target: { name: string; value: SeasonData } }) => void;
  /** CSS class to be applied to the component */
  className?: string;
};

export const SingleSeasonSelectField: React.FC<
  SingleSeasonSelectFieldProps
> = ({ value, onChange, ...props }) => (
  <SeasonSelectField
    {...props}
    maxItems={1}
    value={value ? [value] : []}
    onChange={(e) => {
      onChange?.({
        target: {
          name: props.name,
          value: e.target.value[0],
        },
      });
    }}
  />
);
