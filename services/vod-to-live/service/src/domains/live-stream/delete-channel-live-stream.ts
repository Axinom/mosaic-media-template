import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { Config } from 'src/common';
import { AzureStorage } from '../azure';
import { KeyServiceApi } from '../key-service';
import { ChannelMetadataModel } from '../models';
import { VirtualChannelApi } from '../virtual-channel';
import { generateChannelFilePath, metadataFileName } from './utils';

const logger = new Logger({ context: 'delete-channel-live-stream' });
export const deleteChannelLiveStream = async (
  channelId: string,
  virtualChannelApi: VirtualChannelApi,
  storage: AzureStorage,
  keyServiceApi: KeyServiceApi,
  config: Config,
): Promise<void> => {
  try {
    const result = await virtualChannelApi.deleteChannel(channelId);

    const storedChannelJson = await storage.getFileContent(
      generateChannelFilePath(channelId, metadataFileName),
    );
    const storedChannelMetadata: ChannelMetadataModel =
      JSON.parse(storedChannelJson);
    if (config.isDrmEnabled && storedChannelMetadata.key_id) {
      await keyServiceApi.deleteContentKey(storedChannelMetadata.key_id);
    }
    const storageFileDeletion = await storage.deleteFolder(channelId);
    logger.log({
      message: 'Channel deletion result:',
      details: {
        channelId,
        virtualChannelDeletionResult: result,
        deletedMetadataFiles: storageFileDeletion,
      },
    });
  } catch (error) {
    throw getMappedError(error);
  }
};
