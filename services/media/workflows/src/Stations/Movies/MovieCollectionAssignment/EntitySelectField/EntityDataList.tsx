import { createThumbnailAndStateRenderer } from '@axinom/mosaic-managed-workflow-integration';
import {
  ActionData,
  DynamicDataList,
  DynamicListColumn,
  IconName,
} from '@axinom/mosaic-ui';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { EntityType } from '../../../../generated/graphql';
import { PublishStatusStateMap } from '../../../../Util/PublishStatusStateMap/PublishStatusStateMap';
import { StringEnumRenderer } from '../../../../Util/StringEnumRenderer/StringEnumRenderer';
import { MovieRelatedCollections } from '../CollectionEntityManagement.types';
import { useEntityDataListDataEntry } from './EntityDataListDataEntry/EntityDataListDataEntry';

interface EntityDataListProps {
  /** Entities of the Collection */
  value: MovieRelatedCollections[];
  /** Raised when the list has changed */
  onChange: (values: MovieRelatedCollections[]) => void;
}

type EntityIDEntityType =
  `${MovieRelatedCollections['entityId']}_${EntityType}`;

export const EntityDataList: React.FC<EntityDataListProps> = ({
  onChange,
  value,
}) => {
  const { EntityDataListDataEntry } = useEntityDataListDataEntry({
    excludeItems: value,
  });

  const columns: DynamicListColumn<MovieRelatedCollections>[] = useMemo(
    (): DynamicListColumn<MovieRelatedCollections>[] => [
      {
        propertyName: 'publishStatus',
        label: 'State',
        render: createThumbnailAndStateRenderer(
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
    data: MovieRelatedCollections,
  ) => ActionData[] = (data) => {
    return [
      {
        label: 'Open Details',
        path: createEntityUrl(data),
        icon: IconName.NavigateRight,
      },
      {
        label: 'Unassign',
        onActionSelected: () =>
          handleUnassign(`${data.entityId}_${data.entityType}`),
        icon: IconName.X,
      },
    ];
  };

  return (
    <DynamicDataList<MovieRelatedCollections>
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
}: MovieRelatedCollections): string => {
  switch (entityType) {
    case EntityType.Collection:
      return `/movies/${entityId}`;
  }
};

const TitleRenderer = (val: unknown): ReactNode => {
  if (!val) {
    return <div>Entity not Found</div>;
  }

  return String(val);
};
