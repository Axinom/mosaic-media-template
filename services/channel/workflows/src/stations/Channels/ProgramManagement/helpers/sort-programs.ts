import {
  Program,
  ProgramBreakType,
  ProgramCuePointsConnection,
  ProgramsConnection,
} from '../../../../generated/graphql';

type CuePointNodes = ProgramCuePointsConnection['nodes'];

/**
 * Responsible for:
 * Sorting programs by sortIndex
 * Program cue points by types, PRE, MIDs(which are also sorted by timeInSeconds), and finally POST
 * Sorting schedules by sortIndex
 * @param programs - Form programs
 * @returns sorted programs
 */
export const sortPrograms = (
  programs: ProgramsConnection,
): ProgramsConnection => {
  const sortedPrograms = (programs?.nodes ?? []).sort(
    (a, b) => a.sortIndex - b.sortIndex,
  );

  const programNodes: Program[] = [];
  if (programs?.nodes) {
    for (let p = 0; p < programs.nodes.length; p++) {
      const program = sortedPrograms[p];
      if (program?.programCuePoints?.nodes?.length > 0) {
        const preNodes: CuePointNodes = [];
        const midNodes: CuePointNodes = [];
        const postNodes: CuePointNodes = [];

        for (let cp = 0; cp < program.programCuePoints.nodes.length; cp++) {
          const cpNode = program.programCuePoints.nodes[cp];
          (cpNode?.cuePointSchedules?.nodes ?? []).sort(
            (a, b) => a.sortIndex - b.sortIndex,
          );

          switch (cpNode.type) {
            case ProgramBreakType.Pre:
              preNodes.push(cpNode);
              break;
            case ProgramBreakType.Post:
              postNodes.push(cpNode);
              break;
            default:
              midNodes.push(cpNode);
              break;
          }
        }

        programNodes.push({
          ...program,
          programCuePoints: {
            ...program.programCuePoints,
            nodes: [
              ...preNodes,
              ...midNodes.sort(
                (a, b) =>
                  (a.timeInSeconds as number) - (b.timeInSeconds as number),
              ),
              ...postNodes,
            ],
          },
        });
      } else {
        programNodes.push(program);
      }
    }
  }

  const sortedProgramNodes: ProgramsConnection = {
    ...programs,
    nodes: programNodes.sort((a, b) => a.sortIndex - b.sortIndex),
  };
  return sortedProgramNodes;
};
