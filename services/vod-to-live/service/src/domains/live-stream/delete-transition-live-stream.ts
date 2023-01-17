import { Broker } from '@axinom/mosaic-message-bus';
import { ChannelPublishedEvent } from '@axinom/mosaic-messages';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import {
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { AzureStorage } from '../azure';
import { ChannelSmilGenerator, convertObjectToXml } from '../smil';
import { VirtualChannelApi } from '../virtual-channel';
import { generateChannelStorageName } from './utils';

const logger = new Logger({ context: 'delete-transition-live-stream' });
export const deleteTransitionLiveStream = async (
  channelId: string,
  playlistId: string,
  virtualChannelApi: VirtualChannelApi,
  storage: AzureStorage,
  broker: Broker,
  authToken: string,
): Promise<void> => {
  try {
    const playlistTransitions = await virtualChannelApi.getPlaylistTransitions(
      channelId,
      playlistId,
    );
    for (const { transitionDate } of playlistTransitions) {
      const result = await virtualChannelApi.deleteTransition(
        channelId,
        transitionDate,
      );
      logger.debug({
        message: `Transition with date ${transitionDate} deletion result:`,
        details: {
          channelId,
          playlistId,
          transitionDate,
          responseMessage: result,
        },
      });
    }

    //if there is no playlist transitions left in virtual channel - new transition with channel video is created
    //making sure, that virtual channel will have content playing and that the latest placeholder video is played
    if (!(await virtualChannelApi.channelHasPlaylistTransitions(channelId))) {
      const channelLatestJson = await storage.getFileContent(
        generateChannelStorageName(channelId),
      );
      const event: ChannelPublishedEvent = JSON.parse(channelLatestJson);
      if (!event) {
        logger.warn(
          `Channel ${channelId} was not found in the Azure Storage. Cannot create channel transition.`,
        );
        return;
      }
      const generator = new ChannelSmilGenerator();
      const smil = generator.generate(event);
      await broker.publish<PrepareTransitionLiveStreamCommand>(
        VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
          .messageType,
        {
          channel_id: channelId,
          playlist_id: channelId,
          playlist_start_date_time: new Date().toISOString(),
          smil: convertObjectToXml(smil),
        },
        {
          auth_token: authToken,
        },
      );
    }
  } catch (error) {
    throw getMappedError(error);
  }
};
