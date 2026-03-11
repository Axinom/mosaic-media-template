import { SingleLineTextProps, useFormikError } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ExtensionsContext } from '../../externals';

export const MainVideoSelectionField: React.FC<SingleLineTextProps> = (
  props,
) => {
  const { VideoSelectField } = useContext(ExtensionsContext);
  const { value, onChange, name, label = '' } = props;
  const error = useFormikError(props.name);

  return (
    <VideoSelectField
      {...props}
      defaultFilterTag="MAIN"
      label={label}
      value={value ? [value] : []}
      onChange={(event) => {
        const value = (event as React.ChangeEvent<HTMLInputElement>)
          .currentTarget.value[0];
        onChange?.({
          ...(event as React.ChangeEvent<HTMLInputElement>),
          currentTarget: {
            ...(event as React.ChangeEvent<HTMLInputElement>).currentTarget,
            name: name,
            value: value,
          },
        });
      }}
      maxItems={1}
      error={error}
    />
  );
};
