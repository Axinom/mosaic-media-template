import { Broker } from '@axinom/mosaic-message-bus';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import {
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { AzureStorage } from '../azure';
import {
  createDashCpixRequest,
  createHlsCpixRequest,
  storeSpekeResponse,
} from '../cpix';
import { KeyServiceApi } from '../key-service';
import { ChannelMetadataModel } from '../models';
import { VirtualChannelApi } from '../virtual-channel';
import {
  generateChannelFilePath,
  metadataFileName,
  protectionDashCpixFileName,
  protectionHlsCpixFileName,
} from './utils';

const logger = new Logger({ context: 'prepare-channel-live-stream' });

export const prepareChannelLiveStream = async (
  channelId: string,
  smil: string,
  json: string,
  virtualChannelApi: VirtualChannelApi,
  storage: AzureStorage,
  keyServiceApi: KeyServiceApi,
  broker: Broker,
  authToken: string | undefined,
): Promise<void> => {
  try {
    const newChannelMetadata: ChannelMetadataModel = JSON.parse(json);
    const runningVirtualChannels = await virtualChannelApi.getChannels();
    if (runningVirtualChannels.find((rvc) => rvc.name === channelId)) {
      // if channel doesn't have any playlist transitions - new transition with channel's updated placeholder video is created
      if (!(await virtualChannelApi.channelHasPlaylistTransitions(channelId))) {
        await broker.publish<PrepareTransitionLiveStreamCommand>(
          VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
            .messageType,
          {
            channel_id: channelId,
            playlist_id: channelId,
            transition_start_date_time: new Date().toISOString(),
            smil: smil,
          },
          {
            auth_token: authToken,
          },
        );
      }
      const storedChannelJson = await storage.getFileContent(
        generateChannelFilePath(channelId, metadataFileName),
      );
      const storedChannelMetadata: ChannelMetadataModel =
        JSON.parse(storedChannelJson);
      newChannelMetadata.key_id = storedChannelMetadata.key_id;
    } else {
      const channelKey = await keyServiceApi.postContentKey(channelId);
      newChannelMetadata.key_id = channelKey.Id;
      const protectionCpixCreationResult = await createProtectionCpix(
        channelKey.Id,
        channelId,
        keyServiceApi,
        storage,
      );
      const channelCreationResult = await virtualChannelApi.putChannel(
        channelId,
        smil,
      );
      //TODO: send RabbitMQ event message to channel's key_id (or send channel metadata + key_id?)
      logger.debug({
        message: `Virtual Channel ${channelId} creation result:`,
        details: {
          virtualChannelCreationResult: channelCreationResult,
          encryptionFilesCreationResult: protectionCpixCreationResult,
        },
      });
    }
    const saveResult = await storage.createFile(
      generateChannelFilePath(channelId, metadataFileName),
      JSON.stringify(newChannelMetadata),
    );
    logger.debug({
      message: `Channel ${channelId} metadata saving result:`,
      details: {
        wasSaved: saveResult,
      },
    });
  } catch (error) {
    throw getMappedError(error);
  }
};

/**
 * Executed once per each new channel: creates in the Azure storage in directory {channelId}
 * CPIX files required for DASH and HLS live stream protection.
 * All Live Streams created for the specified channel will use files for protection
 * with Azure SAS token limited in time by the playlist duration.
 */
const createProtectionCpix = async (
  keyId: string,
  channelId: string,
  keyServiceApi: KeyServiceApi,
  azureStorage: AzureStorage,
): Promise<{
  wasHlsCpixFileCreated: boolean;
  wasDashCpixFileCreated: boolean;
}> => {
  // CPIX requests
  const contentId = 'speke';
  const hlsRequest = createHlsCpixRequest(contentId, [keyId]);
  const dashRequest = createDashCpixRequest(contentId, [keyId]);

  // store HLS CPIX response
  const wasHlsCpixFileCreated = await storeSpekeResponse(
    azureStorage,
    keyServiceApi,
    hlsRequest,
    generateChannelFilePath(channelId, protectionHlsCpixFileName),
  );

  // store DASH CPIX response
  const wasDashCpixFileCreated = await storeSpekeResponse(
    azureStorage,
    keyServiceApi,
    dashRequest,
    generateChannelFilePath(channelId, protectionDashCpixFileName),
  );

  return {
    wasHlsCpixFileCreated,
    wasDashCpixFileCreated,
  };
};
