import { SingleLineTextProps } from '@axinom/mosaic-ui';
import React from 'react';
import { SeasonData } from '../../../Seasons/SeasonExplorerBase/SeasonExplorer.types';
import { SeasonSelectField } from '../../../Seasons/SeasonSelection';

export const BulkEditSeasonSelectionField: React.FC<SingleLineTextProps> = (
  props,
) => {
  const { onChange, name, value, label = '' } = props;
  const [localValue, setLocalValue] = React.useState<SeasonData[]>([]);

  React.useEffect(() => {
    // Reset local value if the main value is cleared.
    // No need to set the local value with a value from Formik since it always starts as empty and we only allow single selection.
    if (!value) {
      setLocalValue([]);
    }
  }, [value]);

  return (
    <SeasonSelectField
      {...props}
      label={label}
      value={localValue}
      onChange={(event) => {
        setLocalValue(event.target.value);
        const value = event.target.value[0].id;
        onChange?.({
          ...(event as unknown as React.ChangeEvent<HTMLInputElement>),
          target: {
            ...(event as unknown as React.ChangeEvent<HTMLInputElement>).target,
            name: name,
            value: value as unknown as string,
          },
        });
      }}
      maxItems={1}
    />
  );
};
