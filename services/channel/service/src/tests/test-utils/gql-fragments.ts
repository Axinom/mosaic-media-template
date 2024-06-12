import gql, { disableFragmentWarnings } from 'graphql-tag';

// graphql-tag logs warnings for fragments with the same name. Since we only
// use fragments individually for queries in test files - these warning are disabled
disableFragmentWarnings();

export const PROGRAM_CUE_POINT_PROPERTIES_FRAGMENT = gql`
  fragment properties on ProgramCuePoint {
    id
    timeInSeconds
    value
    videoCuePointId
    programId
    type
    createdDate
    createdUser
    updatedDate
    updatedUser
  }
`;

export const CUE_POINT_SCHEDULE_PROPERTIES_FRAGMENT = gql`
  fragment properties on CuePointSchedule {
    id
    sortIndex
    videoId
    durationInSeconds
    programCuePointId
    type
    createdDate
    createdUser
    updatedDate
    updatedUser
  }
`;
