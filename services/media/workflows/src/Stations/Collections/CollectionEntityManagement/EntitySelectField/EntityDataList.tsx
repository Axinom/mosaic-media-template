import {
  ActionData,
  ActionType,
  DynamicDataList,
  DynamicListColumn,
  IconName,
} from '@axinom/mosaic-ui';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { getThumbnailAndStateRenderer } from '../../../../externals';
import { EntityType } from '../../../../generated/graphql';
import { PublishStatusStateMap } from '../../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { StringEnumRenderer } from '../../../../Util/StringEnumRenderer/StringEnumRenderer';
import { CollectionRelatedEntity } from '../CollectionEntityManagement.types';
import { useEntityDataListDataEntry } from './EntityDataListDataEntry/EntityDataListDataEntry';
//import { useEntityDataListDataEntry2 } from './EntityDataListDataEntry2';

interface EntityDataListProps {
  /** Entities of the Collection */
  value: CollectionRelatedEntity[];
  /** Raised when the list has changed */
  onChange: (values: CollectionRelatedEntity[]) => void;
}

type EntityIDEntityType =
  `${CollectionRelatedEntity['entityId']}_${EntityType}`;

export const EntityDataList: React.FC<EntityDataListProps> = ({
  onChange,
  value,
}) => {
  const history = useHistory();
  const { EntityDataListDataEntry } = useEntityDataListDataEntry({
    excludeItems: value,
  });

  const columns: DynamicListColumn<CollectionRelatedEntity>[] = useMemo(
    (): DynamicListColumn<CollectionRelatedEntity>[] => [
      {
        propertyName: 'publishStatus',
        label: 'State',
        render: getThumbnailAndStateRenderer()(
          'entityImages',
          PublishStatusStateMap,
        ),
        size: '80px',
      },
      {
        propertyName: 'title',
        label: 'Title',
        size: '3fr',
        render: TitleRenderer,
      },
      {
        label: 'Entity Type',
        propertyName: 'entityType',
        render: StringEnumRenderer,
      },
    ],
    [],
  );

  const handleUnassign = useCallback(
    (entity: EntityIDEntityType) => {
      onChange(
        value.filter((val) => `${val.entityId}_${val.entityType}` !== entity),
      );
    },
    [onChange, value],
  );

  const generateInlineMenuActions: (
    data: CollectionRelatedEntity,
  ) => ActionData[] = (data) => {
    return [
      {
        label: 'Open Details',
        onActionSelected: () => history.push(createEntityUrl(data)),
        actionType: ActionType.Navigation,
        icon: IconName.NavigateRight,
      },
      {
        label: 'Unassign',
        onActionSelected: () =>
          handleUnassign(`${data.entityId}_${data.entityType}`),
        actionType: ActionType.Context,
        icon: IconName.X,
      },
    ];
  };

  return (
    <DynamicDataList<CollectionRelatedEntity>
      value={value}
      columns={columns}
      onChange={onChange}
      allowReordering={true}
      allowNewData={true}
      positionPropertyName="sortOrder"
      customDataEntry={EntityDataListDataEntry}
      stickyHeader={false}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};

const createEntityUrl = ({
  entityType,
  entityId,
}: CollectionRelatedEntity): string => {
  switch (entityType) {
    case EntityType.Movie:
      return `/movies/${entityId}`;
    case EntityType.Tvshow:
      return `/tvshows/${entityId}`;
    case EntityType.Season:
      return `/seasons/${entityId}`;
    case EntityType.Episode:
      return `/episodes/${entityId}`;
  }
};

const TitleRenderer = (val: unknown): ReactNode => {
  if (!val) {
    return <div>Entity not Found</div>;
  }

  return String(val);
};
