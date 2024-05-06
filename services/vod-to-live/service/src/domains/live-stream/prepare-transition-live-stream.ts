import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { VirtualChannelApi } from '../virtual-channel';
import { isFutureDate, Transition } from './utils';

const logger = new Logger({ context: 'prepare-transition-live-stream' });

/**
 * This function prepares a live stream for a playlist.
 * @param channelId - unique identifier of the channel.
 * @param playlistId - unique identifier of the playlist.
 * @param transitionDateTime - start date time for the transition.
 * @param smil - XML content of the SMIL document.
 * @param virtualChannelApi - instance of VirtualChannelApi class
 */
export const prepareTransitionLiveStream = async (
  channelId: string,
  playlistId: string,
  transitionDateTime: string,
  smil: string,
  virtualChannelApi: VirtualChannelApi,
): Promise<void> => {
  try {
    const playlistTransitions: Transition[] =
      await virtualChannelApi.getPlaylistTransitions(channelId, playlistId);
    if (playlistTransitions.length !== 0) {
      // removing all future transitions for playlist
      const futureTransitions = playlistTransitions.filter((t) =>
        isFutureDate(t.transitionDate),
      );
      for (const futureTransition of futureTransitions) {
        const newTransitionDate = new Date(transitionDateTime).toISOString();

        if (futureTransition.transitionDate !== newTransitionDate) {
          const deletionResult = await virtualChannelApi.deleteTransition(
            channelId,
            futureTransition.transitionDate,
          );
          logger.log({
            message: `Result of removing previously planned playlist transition:`,
            details: {
              channelId,
              playlistId,
              oldTransitionDate: futureTransition.transitionDate,
              newTransitionDate: newTransitionDate,
              responseMessage: deletionResult,
            },
          });
        }
      }
    }
    return createTransition(
      channelId,
      playlistId,
      transitionDateTime,
      smil,
      virtualChannelApi,
    );
  } catch (error) {
    throw getMappedError(error);
  }
};

const createTransition = async (
  channelId: string,
  playlistId: string,
  transitionStartDateTime: string,
  smil: string,
  virtualChannelApi: VirtualChannelApi,
): Promise<void> => {
  const transitionCreationResult = await virtualChannelApi.putTransition(
    channelId,
    transitionStartDateTime,
    smil,
    true,
  );
  logger.log({
    message: `The result of creating a transition for playlist ${playlistId}:`,
    details: {
      channelId,
      playlistId,
      transitionStartDateTime,
      responseMessage: transitionCreationResult,
    },
  });
};
