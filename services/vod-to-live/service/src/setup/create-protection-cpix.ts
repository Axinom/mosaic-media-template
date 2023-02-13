import { Logger } from '@axinom/mosaic-service-common';
import { Config } from '../common';
import {
  AzureStorage,
  createDashCpixRequest,
  createHlsCpixRequest,
  KeyServiceApi,
  protectionDashCpixFileName,
  protectionHlsCpixFileName,
  storeSpekeResponse,
} from '../domains';

/**
 * Executed once on service startup: creates in the root of the Azure storage
 * CPIX files required for DASh and HLS live stream protection.
 * All Live Streams created by Service will use files for protection
 * with Azure SAS token limited in time by the playlist/channel duration.
 */
export const createProtectionCpix = async (
  config: Config,
  keyServiceApi: KeyServiceApi,
  azureStorage: AzureStorage,
  logger: Logger,
): Promise<void> => {
  // CPIX requests
  const contentId = 'speke';
  const hlsRequest = createHlsCpixRequest(contentId, [
    config.drmProtectionKeyId,
  ]);
  const dashRequest = createDashCpixRequest(contentId, [
    config.drmProtectionKeyId,
  ]);

  // store HLS CPIX response
  const wasHlsCpixFileCreated = await storeSpekeResponse(
    azureStorage,
    keyServiceApi,
    hlsRequest,
    protectionHlsCpixFileName,
  );

  // store Dash CPIX response
  const wasDashCpixFileCreated = await storeSpekeResponse(
    azureStorage,
    keyServiceApi,
    dashRequest,
    protectionDashCpixFileName,
  );

  logger.debug({
    message: 'Protection CPIX files were created with  result:',
    details: { wasHlsCpixFileCreated, wasDashCpixFileCreated },
  });
};
