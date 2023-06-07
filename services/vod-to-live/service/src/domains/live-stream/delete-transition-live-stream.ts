import { Broker } from '@axinom/mosaic-message-bus';
import { ChannelPublishedEvent } from '@axinom/mosaic-messages';
import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import {
  PrepareTransitionLiveStreamCommand,
  VodToLiveServiceMessagingSettings,
} from 'media-messages';
import { DAY_IN_SECONDS } from '../../common';
import { AzureStorage } from '../azure';
import { convertObjectToXml } from '../common';
import { CpixSettings, createDecryptionCpix } from '../cpix';
import { KeyServiceApi } from '../key-service';
import { ChannelSmilGenerator } from '../smil';
import { VirtualChannelApi } from '../virtual-channel';
import { generateChannelFilePath, metadataFileName } from './utils';

const logger = new Logger({ context: 'delete-transition-live-stream' });
export const deleteTransitionLiveStream = async (
  channelId: string,
  playlistId: string,
  virtualChannelApi: VirtualChannelApi,
  storage: AzureStorage,
  keyServiceApi: KeyServiceApi,
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
      logger.log({
        message: `Deletion result for the transition with the date ${transitionDate}:`,
        details: {
          channelId,
          playlistId,
          transitionDate,
          responseMessage: result,
        },
      });
    }
    const storageFileDeletion = await storage.deleteFolder(
      `${channelId}/${playlistId}`,
    );
    logger.log({
      message: 'Result of deleting the playlist from Azure Storage:',
      details: {
        channelId,
        deletedFiles: storageFileDeletion,
      },
    });

    //if there is no playlist transitions left in virtual channel - new transition with channel video is created
    //making sure, that virtual channel will have content playing and that the latest placeholder video is played
    if (!(await virtualChannelApi.channelHasPlaylistTransitions(channelId))) {
      const channelLatestJson = await storage.getFileContent(
        generateChannelFilePath(channelId, metadataFileName),
      );
      const event: ChannelPublishedEvent = JSON.parse(channelLatestJson);
      if (!event) {
        logger.warn(
          `The metadata for channel ${channelId} was not found in Azure Storage. Therefore, a transition cannot be created for the channel.`,
        );
        return;
      }

      const cpixSettings: CpixSettings = {
        decryptionCpixFile: await createDecryptionCpix(
          event.id,
          null,
          {
            videos: event.placeholder_video ? [event.placeholder_video] : [],
            startDate: new Date(),
            durationInSeconds: DAY_IN_SECONDS,
          },
          storage,
          keyServiceApi,
        ),
        // live stream with only Placeholder Video is never protected
        encryptionDashCpixFile: undefined,
        encryptionHlsCpixFile: undefined,
      };
      const generator = new ChannelSmilGenerator(cpixSettings);
      const smil = generator.generate(event);
      await broker.publish<PrepareTransitionLiveStreamCommand>(
        VodToLiveServiceMessagingSettings.PrepareTransitionLiveStream
          .messageType,
        {
          channel_id: channelId,
          playlist_id: channelId,
          transition_start_date_time: new Date().toISOString(),
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
