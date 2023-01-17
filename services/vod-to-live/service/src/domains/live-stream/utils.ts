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

export const generateChannelStorageName = (channelId: string): string =>
  `channel_${channelId}.json`;
