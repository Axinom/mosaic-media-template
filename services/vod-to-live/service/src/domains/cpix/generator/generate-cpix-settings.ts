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
import { CpixRequest, createDecryptionCpixRequest, DRMKey } from '../models';
import { getDrmKeys } from './utils';

/**
 * Creates CPIX file for VODs decryption.
 * @param channelId - unique identifier of the Channel.
 * @param playlistId - playlist unique identifier, if applicable.
 * @param decryptionParams - parameters for decryption of DRM protected videos assigned to stream.
 * @param storage  - reference to Azure Storage class instance.
 * @param keyServiceApi - reference to Key Service API class instance.
 * @returns the SAS url to the decryption CPIX file.
 */
export const createDecryptionCpix = async (
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
  storage: AzureStorage,
  keyServiceApi: KeyServiceApi,
): Promise<string | undefined> => {
  let decryptionCpixFile = undefined;
  if (decryptionParams) {
    const { videos, startDate, durationInSeconds } = decryptionParams;
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

  return decryptionCpixFile;
};

/**
 * Creates links to the CPIX file, that should be used for the live stream protection.
 * @param channelId - unique identifier of the Channel.
 * @param encryptionParams - parameters for protection of resulting Live Stream.
 * @param storage  - reference to Azure Storage class instance.
 */
export const createEncryptionCpix = async (
  channelId: string,
  encryptionType: 'DASH' | 'HLS',
  encryptionParams:
    | {
        startDate: Date;
        durationInSeconds: number;
      }
    | null
    | undefined,
  storage: AzureStorage,
): Promise<string | undefined> => {
  let encryptionCpixFile = undefined;
  if (encryptionParams) {
    const { startDate, durationInSeconds } = encryptionParams;
    const protectionFileName =
      encryptionType === 'DASH'
        ? protectionDashCpixFileName
        : protectionHlsCpixFileName;
    const encryptionAccessEndDate = new Date(
      startDate.getTime() + durationInSeconds * SECOND_IN_MILLISECONDS,
    );
    encryptionCpixFile = await storage.getFileSasUrl(
      generateChannelFilePath(channelId, protectionFileName),
      startDate,
      encryptionAccessEndDate,
    );
  }

  return encryptionCpixFile;
};
/**
 * Post a SPEKE request to the key service and Stores response in Azure Storage.
 * @param storage  - reference to Azure Storage class instance.
 * @param keyServiceApi - reference to Key Service API class instance.
 * @param request - SPEKEv2 Request to POST
 * @param filePath - relative file path where the response should be saved to.
 */
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
