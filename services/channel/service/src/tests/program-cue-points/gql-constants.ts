import gql from 'graphql-tag';
import { PROGRAM_CUE_POINT_PROPERTIES_FRAGMENT } from '../test-utils';

export const UPDATE_PROGRAM_CUE_POINT = gql`
  mutation UpdateProgramCuePoint($input: UpdateProgramCuePointInput!) {
    updateProgramCuePoint(input: $input) {
      programCuePoint {
        ...properties
      }
    }
  }
  ${PROGRAM_CUE_POINT_PROPERTIES_FRAGMENT}
`;

export const CREATE_PROGRAM_CUE_POINT = gql`
  mutation CREATE_PROGRAM_CUE_POINT($input: CreateProgramCuePointInput!) {
    createProgramCuePoint(input: $input) {
      programCuePoint {
        ...properties
      }
    }
  }
  ${PROGRAM_CUE_POINT_PROPERTIES_FRAGMENT}
`;
