import { GenericField } from '@axinom/mosaic-ui';
import { FieldHookConfig } from 'formik';
import React from 'react';
import {
  BulkEditAsyncCollectionAddCollectionRelationInput,
  EntityType,
} from '../../../../generated/graphql';
import { CollectionRelatedEntity } from '../../CollectionEntityManagement/CollectionEntityManagement.types';
import { EntityDataList } from '../../CollectionEntityManagement/EntitySelectField/EntityDataList';

export type BulkEditEntitySelectFieldProps = Pick<
  FieldHookConfig<BulkEditAsyncCollectionAddCollectionRelationInput[]>,
  'name' | 'value'
> & {
  /** Label to be displayed */
  label: string;
  /** onChange handler to be called when the value changes */
  onChange?: (event: {
    target: {
      name: string;
      value: BulkEditAsyncCollectionAddCollectionRelationInput[];
    };
  }) => void;
};

export const BulkEditEntitySelectField: React.FC<
  BulkEditEntitySelectFieldProps
> = (props) => {
  const [value, setValue] = React.useState<CollectionRelatedEntity[]>([]);

  React.useEffect(() => {
    // Reset local value if the main value is cleared.
    // No need to set the local value with a value from Formik since it always starts as empty and we only allow single selection.
    if (!props.value) {
      setValue([]);
    }
  }, [props.value]);

  return (
    <>
      <GenericField label={props.label} name={props.name}>
        <EntityDataList
          value={value}
          // value={[]}
          onChange={(value) => {
            setValue(value);

            if (props.onChange) {
              // Call the onChange handler passed via props, mimicking Formik's event signature
              props.onChange({
                target: {
                  name: props.name,
                  value: value.map((item) => {
                    switch (item.entityType) {
                      case EntityType.Episode:
                        return { episodeId: item.entityId };
                      case EntityType.Season:
                        return { seasonId: item.entityId };
                      case EntityType.Tvshow:
                        return { tvshowId: item.entityId };
                      case EntityType.Movie:
                        return { movieId: item.entityId };
                      default:
                        throw new Error(
                          `Unsupported entityType found when converting to BulkEditAsyncCollectionAddCollectionRelationInput.`,
                        );
                    }
                  }),
                },
              });
            }
          }}
          showHeader={false}
          allowReordering={false}
        />
      </GenericField>
    </>
  );
};
