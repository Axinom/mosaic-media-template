import gql from 'graphql-tag';
import { CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT } from '../test-utils';

export const CREATE_AD_CUE_POINT_SCHEDULE = gql`
  mutation CreateAdCuePointSchedule($input: CreateAdCuePointScheduleInput!) {
    createAdCuePointSchedule(input: $input) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;

export const CREATE_VIDEO_CUE_POINT_SCHEDULE = gql`
  mutation CreateVideoCuePointSchedule(
    $input: CreateVideoCuePointScheduleInput!
  ) {
    createVideoCuePointSchedule(input: $input) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;

export const UPDATE_AD_CUE_POINT_SCHEDULE = gql`
  mutation UpdateAdCuePointSchedule($input: UpdateAdCuePointScheduleInput!) {
    updateAdCuePointSchedule(input: $input) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;

export const UPDATE_VIDEO_CUE_POINT_SCHEDULE = gql`
  mutation UpdateVideoCuePointSchedule(
    $input: UpdateVideoCuePointScheduleInput!
  ) {
    updateVideoCuePointSchedule(input: $input) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;

export const DeleteAndCreateAdCuePointScheduleOperationName =
  'DeleteAndCreateAdCuePoint';
export const DELETE_AND_CREATE_AD_CUE_POINT_SCHEDULE = gql`
  mutation ${DeleteAndCreateAdCuePointScheduleOperationName}(
    $deleteInput: DeleteCuePointScheduleInput!
    $createInput: CreateAdCuePointScheduleInput!
  ) {
    deleteCuePointSchedule: deleteCuePointSchedule(input: $deleteInput) {
      cuePointSchedule {
        ...properties
      }
    }
    createAdCuePointSchedule: createAdCuePointSchedule(input: $createInput) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;

export const DeleteAndCreateVideoCuePointScheduleOperationName =
  'DeleteAndCreateVideoCuePoint';
export const DELETE_AND_CREATE_VIDEO_CUE_POINT_SCHEDULE = gql`
  mutation ${DeleteAndCreateVideoCuePointScheduleOperationName}(
    $deleteInput: DeleteCuePointScheduleInput!
    $createInput: CreateVideoCuePointScheduleInput!
  ) {
    createVideoCuePointSchedule: createVideoCuePointSchedule(
      input: $createInput
    ) {
      cuePointSchedule {
        ...properties
      }
    }
    deleteCuePointSchedule: deleteCuePointSchedule(input: $deleteInput) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;

export const DeleteAndUpdateAdCuePointScheduleOperationName =
  'DeleteAndUpdateAdCuePoint';
export const DELETE_AND_UPDATE_AD_CUE_POINT_SCHEDULE = gql`
  mutation ${DeleteAndUpdateAdCuePointScheduleOperationName}(
    $deleteInput: DeleteCuePointScheduleInput!
    $updateInput: UpdateAdCuePointScheduleInput!
  ) {
    deleteCuePointSchedule: deleteCuePointSchedule(input: $deleteInput) {
      cuePointSchedule {
        ...properties
      }
    }
    updateAdCuePointSchedule: updateAdCuePointSchedule(input: $updateInput) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;

export const DeleteAndUpdateVideoCuePointScheduleOperationName =
  'DeleteAndUpdateVideoCuePoint';
export const DELETE_AND_UPDATE_VIDEO_CUE_POINT_SCHEDULE = gql`
  mutation ${DeleteAndUpdateVideoCuePointScheduleOperationName}(
    $deleteInput: DeleteCuePointScheduleInput!
    $updateInput: UpdateVideoCuePointScheduleInput!
  ) {
    updateVideoCuePointSchedule: updateVideoCuePointSchedule(
      input: $updateInput
    ) {
      cuePointSchedule {
        ...properties
      }
    }
    deleteCuePointSchedule: deleteCuePointSchedule(input: $deleteInput) {
      cuePointSchedule {
        ...properties
      }
    }
  }
  ${CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT}
`;
