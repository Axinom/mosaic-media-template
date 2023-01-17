import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { AzureStorage } from '../azure';
import { VirtualChannelApi } from '../virtual-channel';
import { generateChannelStorageName } from './utils';

const logger = new Logger({ context: 'delete-channel-live-stream' });
export const deleteChannelLiveStream = async (
  channelId: string,
  virtualChannelApi: VirtualChannelApi,
  storage: AzureStorage,
): Promise<void> => {
  try {
    const result = await virtualChannelApi.deleteChannel(channelId);
    logger.debug({
      message: 'Virtual Channel deletion result:',
      details: {
        channelId,
        responseMessage: result,
      },
    });
    const storageFileDeletion = await storage.deleteFile(
      generateChannelStorageName(channelId),
    );
    logger.debug({
      message: 'Channel metadata deletion from Azure Storage result:',
      details: {
        channelId,
        wasDeleted: storageFileDeletion,
      },
    });
  } catch (error) {
    throw getMappedError(error);
  }
};
