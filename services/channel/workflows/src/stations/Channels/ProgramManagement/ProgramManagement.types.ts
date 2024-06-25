import {
  ID,
  ImagePreviewProps,
  Maybe,
  Video,
} from '@axinom/mosaic-managed-workflow-integration';
import { ActionData, Timestamp } from '@axinom/mosaic-ui';
import { FormikErrors } from 'formik';
import {
  CuePointSchedule,
  PlaylistProgramsQuery,
  Program,
  ProgramCuePoint,
  Scalars,
} from '../../../generated/graphql';

export type NewProgram = Pick<
  Program,
  | 'title'
  | 'sortIndex'
  | 'entityId'
  | 'entityType'
  | 'videoId'
  | 'videoDurationInSeconds'
  | 'imageId'
> & { trackId: string };

interface ProgramActionBase {
  type: 'PROGRAM';
  programIndex: number;
}
interface CuePointProgramBase extends Omit<ProgramActionBase, 'type'> {
  type: 'CUE_POINT';
  cuePointIndex: number;
}

interface ScheduleActionBase extends Omit<CuePointProgramBase, 'type'> {
  type: 'SCHEDULE';
  scheduleIndex: number;
}

export type CuePointSelect =
  | Pick<CuePointProgramBase, 'cuePointIndex' | 'programIndex'>
  | undefined;

export interface ScheduleReorderActionData {
  newPosition: number;
  newCuePointId?: string;
}

export type ProgramAction =
  | ({
      action: 'REMOVE';
    } & ProgramActionBase)
  | ({
      action: 'REORDER';
      data: { newPosition: number };
    } & ProgramActionBase)
  | ({
      action: 'ADD';
      data: ProgramEntity[];
    } & ProgramActionBase)
  | ({
      action: 'TOGGLE';
    } & ProgramActionBase);

export type CuePointAction =
  | ({
      action: 'UNASSIGN_ALL';
    } & CuePointProgramBase)
  | ({
      action: 'ADD_AD_POD';
    } & CuePointProgramBase)
  | ({
      action: 'SELECT_VIDEO';
      data: Video;
    } & CuePointProgramBase)
  | ({
      action: 'ADD_VIDEO';
    } & CuePointProgramBase);

export type ScheduleAction =
  | ({
      action: 'UNASSIGN';
    } & ScheduleActionBase)
  | ({
      action: 'DURATION_UPDATE';
      data: { duration: number | null };
    } & ScheduleActionBase)
  | ({
      action: 'REORDER';
      data: ScheduleReorderActionData;
    } & ScheduleActionBase);

export type ProgramFormAction = ProgramAction | CuePointAction | ScheduleAction;

export interface HeaderProps {
  actions: ActionData[];
  addActions: ActionData[];
  isOpen: boolean;
  onToggleClick: () => void;
}

export type CuePointScheduleFormData = Pick<
  CuePointSchedule,
  | 'id'
  | 'type'
  | 'durationInSeconds'
  | 'videoId'
  | 'sortIndex'
  | 'programCuePointId'
>;

export type CuePointScheduleProps = CuePointScheduleFormData & {
  localTime: string;
  errors?: FormikErrors<CuePointScheduleFormData>;
  onChange: (action: ScheduleAction) => void;
  idx: number;
};

export type ProgramCuePointFormData = Pick<
  ProgramCuePoint,
  'id' | 'videoCuePointId' | 'type' | 'timeInSeconds'
> & {
  cuePointSchedules: { __typename?: 'CuePointSchedulesConnection' } & {
    nodes: ({ __typename?: 'CuePointSchedule' } & CuePointScheduleFormData)[];
  };
};

export type ProgramCuePointProps = ProgramCuePointFormData & {
  startTimeUTC: string;
  localTime: string;
  errors?: FormikErrors<ProgramCuePointFormData>;
  onChange: (action: CuePointAction | ScheduleAction) => void;
};

export type ProgramFormData = Pick<
  Program,
  | 'id'
  | 'sortIndex'
  | 'title'
  | 'entityId'
  | 'entityType'
  | 'videoDurationInSeconds'
  | 'imageId'
  | 'videoId'
> & {
  programCuePoints: { __typename?: 'ProgramCuePointsConnection' } & {
    nodes: ({ __typename?: 'ProgramCuePoint' } & ProgramCuePointFormData & {
        cuePointSchedules: { __typename?: 'CuePointSchedulesConnection' } & {
          nodes: ({
            __typename?: 'CuePointSchedule';
          } & CuePointScheduleFormData)[];
        };
      })[];
  };
};

export type ProgramProps = ProgramFormData & {
  startTime: Timestamp;
  endTime: Timestamp;
  errors?: FormikErrors<ProgramFormData>;
  ImagePreview: React.FC<ImagePreviewProps>;
  resolver?: FastProviderData['detailsResolver'];
  isOpen: boolean;
  trackId?: string;
  onToggle: (uuid: string, isOpen: boolean | null) => void;
  onChange: (action: ProgramFormAction) => void;
};

export type ProgramManagementFormData = NonNullable<
  PlaylistProgramsQuery['playlist']
>;

export interface CuePointTimes {
  time: string;
}
export interface ProgramTimes {
  startTime: Timestamp;
  endTime: Timestamp;
  totalDuration: number;
  cuePointTimes?: CuePointTimes;
}

export interface ProgramManagementContextMetadata {
  playListDuration?: Timestamp;
  playListEndTime?: string;
  playListStartTime?: string;
  entityTypeCounts?: Record<string, number>;
}

export interface ProgramManagementContextProps {
  allProviders: FastProviderData[];
  providerTypeMap: ProgramMap;
  metadata: ProgramManagementContextMetadata;
  updateMetadata: (value: ProgramManagementContextMetadata) => void;
}

export type ProgramEntity = Pick<
  Program,
  'title' | 'videoId' | 'entityId' | 'entityType' | 'imageId'
>;

export type ProgramCuePointPayLoad = Pick<
  ProgramCuePoint,
  'videoCuePointId' | 'type' | 'timeInSeconds' | 'value'
> & { programId?: Scalars['UUID']; id?: Scalars['UUID'] };

export type CuePointSchedulePayLoad = Pick<
  CuePointSchedule,
  'sortIndex' | 'type' | 'durationInSeconds' | 'videoId'
> & {
  programCuePointId?: Scalars['UUID'];
  id?: Scalars['UUID'];
};

export interface ProgramDetailsResolverArgs {
  entityId: ProgramEntity['entityId'];
  entityType: ProgramEntity['entityType'];
}

export interface ProgramSelectionProps<T> {
  onClose: () => void;
  onSelected: (item: T) => ProgramEntity;
}
export interface ProgramDetailsResolverArgs {
  entityId: ProgramEntity['entityId'];
  entityType: ProgramEntity['entityType'];
}

export type ProgramMap = Record<FastProviderData['type'], FastProviderData>;

export type CpsNodes =
  ProgramFormData['programCuePoints']['nodes'][number]['cuePointSchedules']['nodes'];

export type FastProviderType = 'fast-provider';

export interface FastProgramEntity {
  title: string;
  videoId: ID;
  entityId: string;
  imageId?: Maybe<ID>;
}

export interface FastProviderData {
  type: string;
  label: string;
  selectionComponent: React.FC<{
    onClose: () => void;
    onSelected: (items: FastProgramEntity[]) => void;
  }>;
  detailsResolver?: (params: {
    entityId: string;
    entityType: string;
  }) => string;
}
