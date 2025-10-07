import {
  ActionData,
  DynamicDataList,
  DynamicListColumn,
  IconName,
} from '@axinom/mosaic-ui';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { SeasonData } from '../../SeasonExplorerBase/SeasonExplorer.types';
import classes from './SeasonDataList.module.scss';
import { useSeasonDataListDataEntry } from './SeasonDataListEntry';

interface SeasonDataListProps {
  /** Seasons of the Tv Show */
  value: SeasonData[];
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Raised when the list has changed */
  onChange: (values: SeasonData[]) => void;
}

export const SeasonDataList: React.FC<SeasonDataListProps> = ({
  maxItems,
  value = [],
  onChange,
}) => {
  const { SeasonDataListDataEntry } = useSeasonDataListDataEntry({
    excludeItems: value,
  });

  const handleUnassign = useCallback(
    (id: SeasonData['id']) => {
      onChange(value.filter((val) => val.id !== id));
    },
    [onChange, value],
  );

  const columns: DynamicListColumn<SeasonData>[] = useMemo(
    (): DynamicListColumn<SeasonData>[] => [
      {
        propertyName: 'index',
        size: '3fr',
        render: TitleRenderer,
      },
      {
        propertyName: 'externalId',
        size: '2fr',
      },
    ],
    [],
  );

  const generateInlineMenuActions: (data: SeasonData) => ActionData[] = ({
    id,
  }) => {
    return [
      // TODO: Include "Replace" option too.
      {
        label: 'Unassign',
        onActionSelected: () => handleUnassign(id),
        icon: IconName.X,
      },
      {
        label: 'Open Details',
        path: `/seasons/${id}`,
        icon: IconName.NavigateRight,
      },
    ];
  };

  return (
    <DynamicDataList<SeasonData>
      value={value}
      columns={columns}
      onChange={onChange}
      allowReordering={false}
      showHeader={false}
      allowNewData={maxItems === undefined || value.length < maxItems}
      customDataEntry={SeasonDataListDataEntry}
      stickyHeader={false}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};

const TitleRenderer = (val: unknown): ReactNode => {
  if (val === null || val === undefined) {
    return <div className={classes.error}>Season not Found</div>;
  }

  return `Season ${val}`;
};
