import {
  SingleImageSelectFieldProps,
  VideoSelectFieldProps,
} from '@axinom/mosaic-managed-workflow-integration';
import {
  BulkEditEnumType,
  BulkEditFormFieldsConfigConverter,
  defaultComponentMap,
  SingleLineTextProps,
} from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ExtensionsContext } from '../../../../externals';
import { MovieImageType } from '../../../../generated/graphql';
import { MoviesBulkEditConfig } from './MoviesBulkEditConfig';

export const MoviesBulkEdit: React.FC = () => {
  const componentMap = {
    ...defaultComponentMap,
    CoverImageSelection: getImageSelectField(MovieImageType.Cover),
    TeaserImageSelection: getImageSelectField(MovieImageType.Teaser),
    VideoSelection: TrailerVideoSelectionField,
    UUID: MainVideoSelectionField,
  };

  const fields = MoviesBulkEditConfig.fields;

  return BulkEditFormFieldsConfigConverter(
    Object.keys(fields)
      .sort()
      .reduce((acc, key) => {
        acc[key] = fields[key];
        return acc;
      }, {}),
    componentMap,
  );
};

const getImageSelectField: (
  type: MovieImageType,
) => React.FC<SingleImageSelectFieldProps> = (type) => {
  const Component: React.FC<SingleImageSelectFieldProps> = (props) => {
    const { SingleImageSelectField } = useContext(ExtensionsContext);
    return (
      <SingleImageSelectField
        {...props}
        value={props.value?.[0].imageId}
        onChange={(event) => {
          const value = [
            {
              imageId: (event as React.ChangeEvent<HTMLInputElement>)
                .currentTarget.value,
              imageType: new BulkEditEnumType(type.toString()),
            },
          ];

          props.onChange({
            currentTarget: {
              name: props.name,
              value,
            },
          });
        }}
        imageType={`movie_${type.toLowerCase()}`}
      />
    );
  };
  Component.displayName = `ImageSelectField_${type}`;
  return Component;
};

const TrailerVideoSelectionField: React.FC<VideoSelectFieldProps> = (props) => {
  const { VideoSelectField } = useContext(ExtensionsContext);
  const { value, onChange, name } = props;

  return (
    <VideoSelectField
      {...props}
      value={value?.map((trailer) => trailer.videoId) ?? []}
      onChange={(event) => {
        const value = (
          (event as React.ChangeEvent<HTMLInputElement>).currentTarget
            .value as unknown as string[]
        ).map((id) => ({ videoId: id }));
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
    />
  );
};

const MainVideoSelectionField: React.FC<SingleLineTextProps> = (props) => {
  const { VideoSelectField } = useContext(ExtensionsContext);
  const { value, onChange, name, label = '' } = props;

  return (
    <VideoSelectField
      {...props}
      label={label}
      value={value ? [value] : []}
      onChange={(event) => {
        const value = (event as React.ChangeEvent<HTMLInputElement>)
          .currentTarget.value[0];
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
      maxItems={1}
    />
  );
};
