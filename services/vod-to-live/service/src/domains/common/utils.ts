import { create } from 'xmlbuilder2';
import { ExpandObject } from 'xmlbuilder2/lib/interfaces';
import { SECOND_IN_MILLISECONDS } from '../../common';

/**
 * Converts any object to string XML representation.
 * @param expandedObject - object to convert to XML.
 * @returns- string containing XML of the object.
 */
export const convertObjectToXml = (
  expandedObject: string | ExpandObject,
): string => {
  return create({ version: '1.0', encoding: 'UTF-8' }, expandedObject).end({
    prettyPrint: true,
    spaceBeforeSlash: true,
  });
};

/**
 * Calculates the duration of the playlist in seconds based on the start and end date/time.
 * @param playlistStartDate - start date-time of the playlist.
 * @param playlistEndDate - end date-time of the playlist.
 * @returns - duration of the playlist in seconds.
 */
export const getPlaylistDurationInSeconds = (
  playlistStartDate: string,
  playlistEndDate: string,
): number => {
  return (
    Math.floor(
      new Date(playlistEndDate).getTime() -
        new Date(playlistStartDate).getTime(),
    ) / SECOND_IN_MILLISECONDS
  );
};
