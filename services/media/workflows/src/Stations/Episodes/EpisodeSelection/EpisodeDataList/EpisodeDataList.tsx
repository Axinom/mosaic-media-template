import {
  ActionData,
  DynamicDataList,
  DynamicListColumn,
  IconName,
} from '@axinom/mosaic-ui';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { EpisodeData } from '../../EpisodeExplorerBase/EpisodeExplorer.types';
import classes from './EpisodeDataList.module.scss';
import { useEpisodeDataListDataEntry } from './EpisodeDataListEntry';

interface EpisodeDataListProps {
  /** Episodes which should be displayed */
  value: EpisodeData[];
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Raised when the list has changed */
  onChange: (values: EpisodeData[]) => void;
}

export const EpisodeDataList: React.FC<EpisodeDataListProps> = ({
  value,
  maxItems,
  onChange,
}) => {
  const { EpisodeDataListDataEntry } = useEpisodeDataListDataEntry({
    excludeItems: value,
  });

  const handleUnassign = useCallback(
    (id: EpisodeData['id']) => {
      onChange(value.filter((val) => val.id !== id));
    },
    [onChange, value],
  );

  const columns: DynamicListColumn<EpisodeData>[] = useMemo(
    (): DynamicListColumn<EpisodeData>[] => [
      {
        propertyName: 'title',
        size: '3fr',
        render: TitleRenderer,
      },
      {
        propertyName: 'index',
      },
      {
        propertyName: 'externalId',
        size: '2fr',
      },
    ],
    [],
  );

  const generateInlineMenuActions: (data: EpisodeData) => ActionData[] = ({
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
        path: `/episodes/${id}`,
        icon: IconName.NavigateRight,
      },
    ];
  };

  return (
    <DynamicDataList<EpisodeData>
      value={value}
      columns={columns}
      onChange={onChange}
      allowReordering={false}
      showHeader={false}
      allowNewData={maxItems === undefined || value.length < maxItems}
      customDataEntry={EpisodeDataListDataEntry}
      stickyHeader={false}
      inlineMenuActions={generateInlineMenuActions}
    />
  );
};

const TitleRenderer = (val: unknown): ReactNode => {
  if (!val) {
    return <div className={classes.error}>Episode not Found</div>;
  }

  return String(val);
};
