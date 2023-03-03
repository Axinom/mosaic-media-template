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
 * Checks if provided string date-time is in the future.
 * @param date - string containing date time.
 * @returns - true if the provided date is in future.
 */
export const isFutureDate = (date: string): boolean => {
  const today = new Date();
  const futureDate = new Date(date);
  return futureDate > today;
};

/**
 * Creates a ISO date time for the transition start.
 * If playlist start date is in future - the start date is used.
 * Otherwise, transition date time is calculated by formula Now + processing buffer in minutes.
 * @param startDateTime - start date time as string ISO for the transition.
 */
export const getTransitionDateTime = (
  startDateTime: string,
  processingTimeInMinutes: number,
): string => {
  if (isFutureDate(startDateTime)) {
    return new Date(startDateTime).toISOString();
  } else {
    return new Date(
      new Date().getTime() + processingTimeInMinutes * 60000,
    ).toISOString();
  }
};

export const metadataFileName = 'metadata.json';
export const decryptionCpixFileName = 'decryption_cpix.xml';

export const protectionHlsCpixFileName = 'protection_hls_cpix.xml';
export const protectionDashCpixFileName = 'protection_dash_cpix.xml';
