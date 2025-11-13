import {
  ActionData,
  DynamicDataList,
  DynamicListColumn,
  IconName,
} from '@axinom/mosaic-ui';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { TvShowData } from '../../TvShowExplorerBase/TvShowExplorer.types';
import classes from './TvShowDataList.module.scss';
import { useTvShowDataListDataEntry } from './TvShowDataListEntry';

interface TvShowDataListProps {
  /** TvShows which should be displayed */
  value: TvShowData[];
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Raised when the list has changed */
  onChange: (values: TvShowData[]) => void;
  /** CSS class to be applied to the component */
  className?: string;
}

export const TvShowDataList: React.FC<TvShowDataListProps> = ({
  value,
  maxItems,
  className,
  onChange,
}) => {
  const { TvShowDataListDataEntry } = useTvShowDataListDataEntry({
    excludeItems: value,
  });

  const handleUnassign = useCallback(
    (id: TvShowData['id']) => {
      onChange(value.filter((val) => val.id !== id));
    },
    [onChange, value],
  );

  const columns: DynamicListColumn<TvShowData>[] = useMemo(
    (): DynamicListColumn<TvShowData>[] => [
      {
        propertyName: 'title',
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

  const generateInlineMenuActions: (data: TvShowData) => ActionData[] = ({
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
        path: `/tvshows/${id}`,
        icon: IconName.NavigateRight,
      },
    ];
  };

  return (
    <DynamicDataList<TvShowData>
      value={value}
      columns={columns}
      onChange={onChange}
      allowReordering={false}
      showHeader={false}
      allowNewData={maxItems === undefined || value.length < maxItems}
      customDataEntry={TvShowDataListDataEntry}
      stickyHeader={false}
      inlineMenuActions={generateInlineMenuActions}
      className={className}
    />
  );
};

const TitleRenderer = (val: unknown): ReactNode => {
  if (!val) {
    return <div className={classes.error}>TV Show not Found</div>;
  }

  return String(val);
};
