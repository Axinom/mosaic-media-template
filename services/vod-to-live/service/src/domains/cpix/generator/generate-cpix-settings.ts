import { DetailedVideo } from '@axinom/mosaic-messages';
import { AzureStorage } from '../../azure';
import { KeyServiceApi } from '../../key-service';
import {
  decryptionCpixFileName,
  generateChannelFilePath,
  generatePlaylistFilePath,
  protectionDashCpixFileName,
  protectionHlsCpixFileName,
} from '../../live-stream/utils';
import { convertObjectToXml } from '../../utils';
import {
  CpixRequest,
  CpixSettings,
  createDecryptionCpixRequest,
  DRMKey,
} from '../models';
import { getDrmKeys } from './utils';

/**
 * Generates a CpixSetting, containing paths to CPIX files required for videos decryption and Live Stream protection.
 * @param videos - list of videos included in the playlist.
 * @param storage - reference to Azure Storage class instance.
 * @param keyServiceApi - reference to Key Service API class instance.
 * @param settingAccessStartDateTime - start date-time of when the protection CPIX should be available.
 * @param settingAccessDurationInSeconds - duration in seconds of how long the CPIX should be available.
 * @param channelId - unique identifier of the Channel.
 * @param playlistId - playlist unique identifier, if applicable.
 * @returns
 */
export const generateCpixSettings = async (
  videos: DetailedVideo[],
  storage: AzureStorage,
  keyServiceApi: KeyServiceApi,
  settingAccessStartDateTime: Date,
  settingAccessDurationInSeconds: number,
  channelId: string,
  playlistId?: string,
): Promise<CpixSettings> => {
  const h = 1; //number of hours added to expiration date end
  const durationOfSasInMilliseconds =
    settingAccessDurationInSeconds * 1000 + h * 60 * 60 * 1000;
  const decryptionSasEndDate = new Date(
    new Date().getTime() + durationOfSasInMilliseconds,
  );
  const protectionSasEndDate = new Date(
    settingAccessStartDateTime.getTime() + durationOfSasInMilliseconds,
  );

  const drmProtectedVideos = videos.filter(
    (v) => v.video_encoding.is_protected,
  );
  const drmKeys = drmProtectedVideos.reduce((result, drmVideo) => {
    return [...result, ...getDrmKeys(drmVideo)];
  }, new Array<DRMKey>());

  //used in the CPIX file as 'contentId' attribute
  const contentId = playlistId ? `${channelId}-${playlistId}` : channelId;
  let decryptionCpixFile: string | undefined = undefined;

  // Create CPIX for videos decryption, if any of the videos were DRM protected.
  if (drmKeys && drmKeys.length > 0) {
    const decryptRequest = createDecryptionCpixRequest(contentId, drmKeys);
    const decryptCpixFilePath = playlistId
      ? generatePlaylistFilePath(channelId, playlistId, decryptionCpixFileName)
      : generateChannelFilePath(channelId, decryptionCpixFileName);
    await storeSpekeResponse(
      storage,
      keyServiceApi,
      decryptRequest,
      decryptCpixFilePath,
    );
    decryptionCpixFile = await storage.getFileSasUrl(
      decryptCpixFilePath,
      new Date(), // decryption token is valid from the moment it is pushed to API
      decryptionSasEndDate,
    );
  }

  // Generate CPIX for DASh and HLS protection
  const encryptionDashCpixFile = await storage.getFileSasUrl(
    protectionDashCpixFileName,
    settingAccessStartDateTime, // protection token start to be accessible from the transition start date-time
    protectionSasEndDate,
  );
  const encryptionHlsCpixFile = await storage.getFileSasUrl(
    protectionHlsCpixFileName,
    settingAccessStartDateTime, // protection token start to be accessible from the transition start date-time
    protectionSasEndDate,
  );
  return {
    decryptionCpixFile,
    encryptionDashCpixFile,
    encryptionHlsCpixFile,
  };
};

export const storeSpekeResponse = async (
  storage: AzureStorage,
  keyServiceApi: KeyServiceApi,
  request: CpixRequest,
  filePath: string,
): Promise<boolean> => {
  const response = await keyServiceApi.postSpekeRequest(
    convertObjectToXml(request),
  );

  return storage.createFile(filePath, response);
};
