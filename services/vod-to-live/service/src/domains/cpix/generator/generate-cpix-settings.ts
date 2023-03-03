import { DetailedVideo } from '@axinom/mosaic-messages';
import { SECOND_IN_MILLISECONDS } from '../../../common';
import {
  decryptionCpixFileName,
  generateChannelFilePath,
  generatePlaylistFilePath,
  protectionDashCpixFileName,
  protectionHlsCpixFileName,
} from '../../../domains/live-stream';
import { AzureStorage } from '../../azure';
import { KeyServiceApi } from '../../key-service';
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
 * @param channelId - unique identifier of the Channel.
 * @param playlistId - playlist unique identifier, if applicable.
 * @param decryptionParams - parameters for decryption of DRM protected videos assigned to stream.
 * @param encryptionParams - parameters for protection of resulting Live Stream.
 * @param storage  - reference to Azure Storage class instance.
 * @param keyServiceApi - reference to Key Service API class instance.
 * @returns
 */
export const generateCpixSettings = async (
  channelId: string,
  playlistId: string | null | undefined,
  decryptionParams:
    | {
        videos: DetailedVideo[];
        startDate: Date;
        durationInSeconds: number;
      }
    | null
    | undefined,
  encryptionParams:
    | {
        startDate: Date;
        durationInSeconds: number;
      }
    | null
    | undefined,
  storage: AzureStorage,
  keyServiceApi: KeyServiceApi,
): Promise<CpixSettings> => {
  let decryptionCpixFile = undefined;
  let encryptionDashCpixFile = undefined;
  let encryptionHlsCpixFile = undefined;
  if (decryptionParams) {
    const { videos } = decryptionParams;
    const drmProtectedVideos = videos.filter(
      (v) => v.video_encoding.is_protected,
    );
    const drmKeys = drmProtectedVideos.reduce((result, drmVideo) => {
      return [...result, ...getDrmKeys(drmVideo)];
    }, new Array<DRMKey>());

    // Create CPIX for videos decryption, if any of the videos were DRM protected.
    if (drmKeys && drmKeys.length > 0) {
      //used in the CPIX file as 'contentId' attribute
      const contentId = playlistId ? `${channelId}-${playlistId}` : channelId;
      const decryptRequest = createDecryptionCpixRequest(contentId, drmKeys);
      const decryptCpixFilePath = playlistId
        ? generatePlaylistFilePath(
            channelId,
            playlistId,
            decryptionCpixFileName,
          )
        : generateChannelFilePath(channelId, decryptionCpixFileName);
      await storeSpekeResponse(
        storage,
        keyServiceApi,
        decryptRequest,
        decryptCpixFilePath,
      );
      const { startDate, durationInSeconds } = decryptionParams;
      const decryptionFileAccessEndDate = new Date(
        startDate.getTime() + durationInSeconds * SECOND_IN_MILLISECONDS,
      );
      decryptionCpixFile = await storage.getFileSasUrl(
        decryptCpixFilePath,
        startDate,
        decryptionFileAccessEndDate,
      );
    }
  }

  if (encryptionParams) {
    const { startDate, durationInSeconds } = encryptionParams;
    const encryptionAccessEndDate = new Date(
      startDate.getTime() + durationInSeconds * SECOND_IN_MILLISECONDS,
    );
    encryptionDashCpixFile = await storage.getFileSasUrl(
      generateChannelFilePath(channelId, protectionDashCpixFileName),
      startDate,
      encryptionAccessEndDate,
    );
    encryptionHlsCpixFile = await storage.getFileSasUrl(
      generateChannelFilePath(channelId, protectionHlsCpixFileName),
      startDate,
      encryptionAccessEndDate,
    );
  }

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
