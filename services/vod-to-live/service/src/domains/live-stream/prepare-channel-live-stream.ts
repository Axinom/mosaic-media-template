import { Broker } from '@axinom/mosaic-message-bus';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import {
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { AzureStorage } from '../azure';
import { VirtualChannelApi } from '../virtual-channel';
import { generateChannelStorageName } from './utils';

const logger = new Logger({ context: 'prepare-channel-live-stream' });

export const prepareChannelLiveStream = async (
  channelId: string,
  smil: string,
  json: string,
  virtualChannelApi: VirtualChannelApi,
  storage: AzureStorage,
  broker: Broker,
  authToken: string | undefined,
): Promise<void> => {
  try {
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
            playlist_start_date_time: new Date().toISOString(),
            smil: smil,
          },
          {
            auth_token: authToken,
          },
        );
      }
    } else {
      const channelCreationResult = await virtualChannelApi.putChannel(
        channelId,
        smil,
      );
      logger.debug({
        message: `Virtual Channel ${channelId} creation result:`,
        details: { responseMessage: channelCreationResult },
      });
    }

    const saveResult = await storage.createFile(
      generateChannelStorageName(channelId),
      json,
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
