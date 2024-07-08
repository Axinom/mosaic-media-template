import {
  EncodingState,
  OutputFormat,
  Video,
  VideoSelectExplorerProps,
} from '@axinom/mosaic-managed-workflow-integration';
import {
  FilterValues,
  ItemSelectEventArgs,
  Modal,
  SelectionExplorerProps,
} from '@axinom/mosaic-ui';
import React from 'react';
import { CuePointSelect } from '../ProgramManagement.types';

interface ScheduleVideoExplorerProps
  extends Omit<
    SelectionExplorerProps<Video>,
    'columns' | 'dataProvider' | 'filterOptions'
  > {
  isVideoSelectionShown: boolean;
  setVideoSelect: React.Dispatch<React.SetStateAction<CuePointSelect>>;
  VideoSelectExplorer: React.FC<VideoSelectExplorerProps>;
  onNewVideoSchedule: (entity: Video) => void;
}

const predefinedFilters: FilterValues<Video> = {
  encodingState: EncodingState.Ready,
  outputFormat: OutputFormat.Cmaf,
};

export const ScheduleVideoExplorer: React.FC<
  Pick<
    ScheduleVideoExplorerProps,
    | 'isVideoSelectionShown'
    | 'setVideoSelect'
    | 'VideoSelectExplorer'
    | 'onNewVideoSchedule'
  >
> = ({
  setVideoSelect,
  onNewVideoSchedule,
  isVideoSelectionShown,
  VideoSelectExplorer,
  ...rest
}) => {
  const onSelectionHandler = (items: ItemSelectEventArgs<Video>): void => {
    const [newSchedule] = items?.items ?? [];
    onNewVideoSchedule(newSchedule);
  };
  return (
    <Modal
      isShown={isVideoSelectionShown}
      onClose={() => setVideoSelect(undefined)}
      onBackDropClicked={() => setVideoSelect(undefined)}
    >
      <VideoSelectExplorer
        {...rest}
        title="Select Video"
        enableSelectAll={false}
        allowBulkSelect={false}
        stationKey="program-management-schedule"
        predefinedFilterValues={predefinedFilters}
        onSelection={(val) => onSelectionHandler(val)}
        onCancel={() => setVideoSelect(undefined)}
      />
    </Modal>
  );
};
