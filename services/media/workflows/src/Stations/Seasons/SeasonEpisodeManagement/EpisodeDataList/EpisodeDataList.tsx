import {
  ActionData,
  ActionType,
  DynamicDataList,
  DynamicListColumn,
  IconName,
} from '@axinom/mosaic-ui';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { SeasonEpisode } from '../SeasonEpisodeManagement.types';
import classes from './EpisodeDataList.module.scss';
import { useEpisodeDataListDataEntry } from './EpisodeDataListEntry';

interface EpisodeDataListProps {
  /** Episodes which should be displayed */
  value: SeasonEpisode[];
  /** Maximum number of items which can be assigned */
  maxItems?: number;
  /** Raised when the list has changed */
  onChange: (values: SeasonEpisode[]) => void;
}

export const EpisodeDataList: React.FC<EpisodeDataListProps> = ({
  value,
  maxItems,
  onChange,
}) => {
  const history = useHistory();
  const { EpisodeDataListDataEntry } = useEpisodeDataListDataEntry({
    excludeItems: value,
  });

  const handleUnassign = useCallback(
    (id: SeasonEpisode['id']) => {
      onChange(value.filter((val) => val.id !== id));
    },
    [onChange, value],
  );

  const columns: DynamicListColumn<SeasonEpisode>[] = useMemo(
    (): DynamicListColumn<SeasonEpisode>[] => [
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

  const generateInlineMenuActions: (data: SeasonEpisode) => ActionData[] = ({
    id,
  }) => {
    return [
      // TODO: Include "Replace" option too.
      {
        label: 'Unassign',
        onActionSelected: () => handleUnassign(id),
        actionType: ActionType.Context,
        icon: IconName.X,
      },
      {
        label: 'Open Details',
        onActionSelected: () => history.push(`/episodes/${id}`),
        actionType: ActionType.Navigation,
        icon: IconName.NavigateRight,
      },
    ];
  };

  return (
    <DynamicDataList<SeasonEpisode>
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
