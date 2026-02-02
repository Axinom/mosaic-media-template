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
  const { EntityDataListDataEntry } = useEntityDataListDataEntry({
    excludeItems: value,
  });

  const columns: DynamicListColumn<CollectionRelatedEntity>[] = useMemo(
    (): DynamicListColumn<CollectionRelatedEntity>[] => [
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
      {
        label: 'Has Expired License',
        propertyName: 'entityLicenses',
        render: (val: unknown, entity: CollectionRelatedEntity) =>
          HasExpiredLicenseRenderer(val, entity.entityType),
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
    case EntityType.Episode:
      return `/episodes/${entityId}`;
    case EntityType.Collection:
      return `/collections/${entityId}`;
    default:
      return `/`;
  }
};

const TitleRenderer = (val: unknown): ReactNode => {
  if (!val) {
    return <div>Entity not Found</div>;
  }

  return String(val);
};

const HasExpiredLicenseRenderer = (
  val: unknown,
  entityType: EntityType,
): ReactNode => {
  // Collections don't have licenses
  if (entityType === EntityType.Collection) {
    return <div>N/A</div>;
  }

  if (!val) {
    return <div>No</div>;
  }
  const currentDate = new Date();
  let licenses: { licenseEnd?: string | null }[] = [];

  licenses = (val as { nodes: { licenseEnd?: string | null }[] }).nodes || [];

  // Check if any license is expired
  const hasExpiredLicense = licenses.some((license) => {
    if (!license.licenseEnd) {
      return false;
    }
    const licenseEndDate = new Date(license.licenseEnd);
    return licenseEndDate < currentDate;
  });

  return <div>{hasExpiredLicense ? 'Yes' : 'No'}</div>;
};
