import {
  ActionType,
  ButtonContext,
  DynamicListDataEntry,
  DynamicListDataEntryProps,
  IconName,
  InlineMenu,
} from '@axinom/mosaic-ui';
import React, { useMemo, useState } from 'react';
import { CollectionRelatedEntity } from '../../CollectionEntityManagement.types';
import { useAddOptions } from './EntityDataListDataEntry.actions';
import {
  UseEntityDataListDataEntryOptions,
  UseEntityDataListDataEntryResult,
} from './EntityDataListDataEntry.types';

export const useEntityDataListDataEntry = (
  options: UseEntityDataListDataEntryOptions,
): UseEntityDataListDataEntryResult => {
  const EntityDataListDataEntry: React.FC<DynamicListDataEntryProps<
    CollectionRelatedEntity
  >> = (props) => {
    const [sortOrder, setSortOrder] = useState<number>(-1);
    const { onActionClicked, ...rest } = props;

    const excludes = useMemo(() => {
      const excludes = {} as Record<string, number[]>;
      options.excludeItems &&
        options.excludeItems.forEach((value) => {
          if (excludes[value.entityType] === undefined) {
            excludes[value.entityType] = [];
          }

          excludes[value.entityType].push(value.entityId);
        });

      return excludes;
    }, []);

    const addOptions = useAddOptions(onActionClicked, excludes, sortOrder);

    return (
      <>
        <DynamicListDataEntry
          onActionClicked={(data) => {
            setSortOrder(data.sortOrder);
          }}
          customAddButton={(onAddItem) => (
            <InlineMenu
              actions={addOptions.map((o) => ({
                label: o.title,
                onActionSelected: o.openModal,
                icon: IconName.Plus,
                actionType: ActionType.Context,
              }))}
              placement="bottom-end"
              showArrow={false}
              buttonIcon={IconName.Plus}
              buttonContext={ButtonContext.Active}
              onButtonClicked={onAddItem}
            />
          )}
          {...rest}
        />

        {addOptions.map((o) => (
          <o.ModalWrapper key={o.title} />
        ))}
      </>
    );
  };

  return { EntityDataListDataEntry };
};
