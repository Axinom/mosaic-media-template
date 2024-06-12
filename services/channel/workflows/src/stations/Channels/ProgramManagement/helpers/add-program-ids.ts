import { FetchResult } from '@apollo/client';
import { UpdatePlaylistMutation } from '../../../../generated/graphql';
import {
  ProgramCuePointPayLoad,
  ProgramManagementFormData as FormData,
  ProgramProps,
} from '../ProgramManagement.types';

type ProgramPayloadType =
  | 'CreateProgramPayload'
  | 'UpdateProgramPayload'
  | 'DeleteProgramPayload';

type ProgramForMapping = Pick<ProgramProps, 'id' | 'sortIndex'>;

interface ProgramData {
  program: ProgramForMapping;
  __typename: ProgramPayloadType;
}

export const addProgramIdsToCuePoints = (
  formData: FormData,
  programResults: FetchResult<UpdatePlaylistMutation>,
): ProgramCuePointPayLoad[] => {
  const cuePoints: ProgramCuePointPayLoad[] = [];

  // extract relevent program results
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updatePlaylist, ...rest } =
    programResults.data as UpdatePlaylistMutation;
  const programData: ProgramData[] = Object.values(
    rest as {
      data: ProgramData;
    },
  );

  // Remove any delete operations as they are handled when the program is deleted
  const pResults = programData.filter(
    (data) => data.__typename !== 'DeleteProgramPayload',
  );

  for (const pNode of formData?.programs?.nodes ?? []) {
    for (const cpNode of pNode?.programCuePoints?.nodes ?? []) {
      // add the cue point if it already has an id as its already been created with a programId
      if (cpNode.id !== undefined) {
        cuePoints.push(cpNode);
        // add programId to newly created cue points only if sortIndex matches the program's form sortIndex
      } else {
        for (const { program } of pResults) {
          if (program.sortIndex === pNode.sortIndex) {
            cuePoints.push({
              ...cpNode,
              programId: program.id,
            });
          }
        }
      }
    }
  }

  return cuePoints;
};
