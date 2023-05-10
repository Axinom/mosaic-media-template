import { MINUTE_IN_MILLISECONDS } from '../../common';
import { HeaderMetadataNames } from '../smil';

export interface Transition {
  status: string;
  smil: string;
  transitionDate: string;
}

export const getPlaylistIdHeaderRegex = (playlistId?: string): RegExp => {
  if (playlistId) {
    return new RegExp(
      `name=\\"${HeaderMetadataNames.MosaicPlaylistId}\\" content=\\"${playlistId}\\"`,
    );
  }

  return new RegExp(`name=\\"${HeaderMetadataNames.MosaicPlaylistId}\\"`);
};

export const generateChannelFilePath = (
  channelId: string,
  fileName: string,
): string => `${channelId}/${fileName}`;

export const generatePlaylistFilePath = (
  channelId: string,
  playlistId: string,
  fileName?: string,
): string => {
  if (fileName) {
    return `${channelId}/${playlistId}/${fileName}`;
  }
  return `${channelId}/${playlistId}`;
};

/**
 * Checks whether the provided date-time string is in the future.e.
 * @param date - a string containing the date-time to be checked.
 * @returns - true if the provided date-time is in the future.
 */
export const isFutureDate = (date: string): boolean => {
  const today = new Date();
  const futureDate = new Date(date);
  return futureDate > today;
};

/**
 * This function creates an ISO date time for the transition start.
 * If the playlist start date is in the future, it uses that date.
 * Otherwise, it calculates the transition date time using
 * the formula "Now + processing buffer in minutes".
 * @param startDateTime - start date time is passed as a string in ISO format.
 * @param catchUpDurationInMinutes - a catch up duration, that would be added for smoother transition.
 */
export const getTransitionDateTime = (
  startDateTime: string,
  catchUpDurationInMinutes: number,
): string => {
  if (isFutureDate(startDateTime)) {
    return new Date(startDateTime).toISOString();
  } else {
    return new Date(
      new Date().getTime() + catchUpDurationInMinutes * MINUTE_IN_MILLISECONDS,
    ).toISOString();
  }
};

export const metadataFileName = 'metadata.json';
export const decryptionCpixFileName = 'decryption_cpix.xml';

export const protectionHlsCpixFileName = 'protection_hls_cpix.xml';
export const protectionDashCpixFileName = 'protection_dash_cpix.xml';
