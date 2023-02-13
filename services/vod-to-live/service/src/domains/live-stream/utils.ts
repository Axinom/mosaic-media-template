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
  fileName: string,
): string => `${channelId}/${playlistId}/${fileName}`;

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

export const metadataFileName = 'metadata.json';
export const decryptionCpixFileName = 'decryption_cpix.xml';

export const protectionHlsCpixFileName = 'protection_hls_cpix.xml';
export const protectionDashCpixFileName = 'protection_dash_cpix.xml';
