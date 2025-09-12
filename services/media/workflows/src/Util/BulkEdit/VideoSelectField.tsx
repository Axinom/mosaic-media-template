import { VideoSelectFieldProps } from '@axinom/mosaic-managed-workflow-integration';
import React, { useContext } from 'react';
import { ExtensionsContext } from '../../externals';

export const getVideoSelectField: (
  type: string,
  maxItems?: number,
) => React.FC<VideoSelectFieldProps> = (type, maxItems) => {
  const Component: React.FC<VideoSelectFieldProps> = (props) => {
    const { VideoSelectField } = useContext(ExtensionsContext);
    const { value, onChange, name } = props;

    return (
      <VideoSelectField
        {...props}
        defaultFilterTag={type}
        value={value?.map((trailer) => trailer.videoId) ?? []}
        onChange={(event) => {
          const value = (
            event as { currentTarget: { value: string[] } }
          ).currentTarget.value.map((id) => ({ videoId: id }));
          onChange &&
            onChange({
              ...(event as React.ChangeEvent<HTMLInputElement>),
              currentTarget: {
                ...(event as React.ChangeEvent<HTMLInputElement>).currentTarget,
                name: name,
                value: value,
              },
            });
        }}
        maxItems={maxItems}
      />
    );
  };
  Component.displayName = `VideoSelectField_${type}`;
  return Component;
};
