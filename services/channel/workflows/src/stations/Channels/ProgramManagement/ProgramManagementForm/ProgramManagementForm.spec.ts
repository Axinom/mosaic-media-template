import { ProgramFormData } from '../ProgramManagement.types';
import {
  getCuePointScheduleNodesField,
  moveCpsNode,
  rearrangeArray,
} from './ProgramManagementForm';

describe('ProgramManagementForm', () => {
  describe('getCuePointScheduleNodesField', () => {
    it('should return the correct path', () => {
      const programIndex = 1;
      const cuePontIndex = 2;
      const expectedPath =
        'programs.nodes[1].programCuePoints.nodes[2].cuePointSchedules.nodes';

      const result = getCuePointScheduleNodesField(programIndex, cuePontIndex);

      expect(result).toEqual(expectedPath);
    });
  });

  describe('moveCpsNode', () => {
    it('should move the cue point schedule node to the destination and update the sort indexes', () => {
      const program = {
        programCuePoints: {
          nodes: [
            {
              id: '1',
              cuePointSchedules: {
                nodes: [
                  { id: '1', sortIndex: 0 },
                  { id: '2', sortIndex: 1 },
                  { id: '3', sortIndex: 2 },
                ],
              },
            },
            {
              id: '2',
              cuePointSchedules: {
                nodes: [],
              },
            },
          ],
        },
      } as ProgramFormData;
      const changes = {
        cuePointIndex: 0,
        scheduleIndex: 1,
        newPosition: 0,
        newCuePointId: '2',
      };
      const expectedSourceCspNodes = [
        { id: '1', sortIndex: 0, programCuePointId: '1' },
        { id: '3', sortIndex: 1, programCuePointId: '1' },
      ];
      const expectedDestinationCpsNodes = [
        { id: '2', sortIndex: 0, programCuePointId: '2' },
      ];
      const expectedDestinationCpsIndex = 1;

      const result = moveCpsNode(program, changes);

      expect(result.sourceCspNodes).toEqual(expectedSourceCspNodes);
      expect(result.destinationCpsNodes).toEqual(expectedDestinationCpsNodes);
      expect(result.destinationCpsIndex).toEqual(expectedDestinationCpsIndex);
    });
  });

  describe('rearrangeArray', () => {
    it('should rearrange array items and update the sortIndex property when moving an item above the current position', () => {
      const array = [
        { id: 1, sortIndex: 0 },
        { id: 2, sortIndex: 1 },
        { id: 3, sortIndex: 2 },
        { id: 4, sortIndex: 3 },
      ];
      const currentIndex = 2;
      const newIndex = 1;
      const expectedArray = [
        { id: 1, sortIndex: 0 },
        { id: 3, sortIndex: 1 },
        { id: 2, sortIndex: 2 },
        { id: 4, sortIndex: 3 },
      ];

      const result = rearrangeArray(array, currentIndex, newIndex);

      expect(result).toEqual(expectedArray);
    });

    it('should rearrange array items and update the sortIndex property when moving an item below the current position', () => {
      const array = [
        { id: 1, sortIndex: 0 },
        { id: 2, sortIndex: 1 },
        { id: 3, sortIndex: 2 },
        { id: 4, sortIndex: 3 },
      ];
      const currentIndex = 1;
      const newIndex = 3;
      const expectedArray = [
        { id: 1, sortIndex: 0 },
        { id: 3, sortIndex: 1 },
        { id: 4, sortIndex: 2 },
        { id: 2, sortIndex: 3 },
      ];

      const result = rearrangeArray(array, currentIndex, newIndex);

      expect(result).toEqual(expectedArray);
    });
  });
});
