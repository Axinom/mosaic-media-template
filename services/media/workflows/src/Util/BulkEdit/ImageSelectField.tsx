import { ImageSelectFieldProps } from '@axinom/mosaic-managed-workflow-integration';
import { BulkEditEnumType, useFormikError } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ExtensionsContext } from '../../externals';

export const getBulkEditImageSelectField: (
  type: string,
  scope: string,
  maxItems?: number,
) => React.FC<ImageSelectFieldProps> = (type, scope, maxItems) => {
  const Component: React.FC<ImageSelectFieldProps> = (props) => {
    const { ImageSelectField } = useContext(ExtensionsContext);
    const error = useFormikError(props.name);
    return (
      <ImageSelectField
        {...props}
        value={props.value ? props.value.map((item) => item.imageId) : []}
        onChange={(event) => {
          const value = (
            event as { currentTarget: { value: string[] } }
          ).currentTarget.value.map((id) => ({
            imageId: id,
            imageType: new BulkEditEnumType(type),
          }));

          props.onChange({
            currentTarget: {
              name: props.name,
              value,
            },
          });
        }}
        imageType={`${scope}_${type.toLowerCase()}`}
        maxItems={maxItems}
        error={error}
      />
    );
  };
  Component.displayName = `ImageSelectField_${type}`;
  return Component;
};
