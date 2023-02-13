import { getMappedError, Logger } from '@axinom/mosaic-service-common';
import { VirtualChannelApi } from '../virtual-channel';
import { isFutureDate, Transition } from './utils';

const logger = new Logger({ context: 'prepare-transition-live-stream' });

/**
 * Prepare live steam for the playlist.
 * @param channelId - unique identifier of the channel.
 * @param playlistId - unique identifier of the playlist.
 * @param playlistStartDateTime - start date time for the playlist.
 * @param smil - XML content of the SMIL document.
 * @param virtualChannelApi - instance of VirtualChannelApi class
 */
export const prepareTransitionLiveStream = async (
  channelId: string,
  playlistId: string,
  playlistStartDateTime: string,
  smil: string,
  virtualChannelApi: VirtualChannelApi,
): Promise<void> => {
  try {
    const playlistTransitions: Transition[] =
      await virtualChannelApi.getPlaylistTransitions(channelId, playlistId);
    if (playlistTransitions.length !== 0) {
      //removing all future transitions for playlist
      const futureTransitions = playlistTransitions.filter((t) =>
        isFutureDate(t.transitionDate),
      );
      for (const futureTransition of futureTransitions) {
        const newTransitionDate = new Date(playlistStartDateTime).toISOString();

        if (futureTransition.transitionDate !== newTransitionDate) {
          const deletionResult = await virtualChannelApi.deleteTransition(
            channelId,
            futureTransition.transitionDate,
          );
          logger.debug({
            message: `Previously planned playlist transition removal result:`,
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
      playlistStartDateTime,
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
  playlistStartDateTime: string,
  smil: string,
  virtualChannelApi: VirtualChannelApi,
): Promise<void> => {
  const transitionDate = determineTransitionDateTime(playlistStartDateTime);
  const transitionCreationResult = await virtualChannelApi.putTransition(
    channelId,
    transitionDate,
    smil,
  );
  logger.debug({
    message: `Transition for playlist ${playlistId} creation result:`,
    details: {
      channelId,
      playlistId,
      transitionDate,
      responseMessage: transitionCreationResult,
    },
  });
};

/**
 * Creates a ISO date time for the transition start.
 * If playlist start date is in future - the start date is used.
 * Otherwise, transition date time is calculated by formula Now + 5 minutes.
 * @param playlistStartDateTime - start date time for the playlist.
 */
const determineTransitionDateTime = (playlistStartDateTime: string): string => {
  if (isFutureDate(playlistStartDateTime)) {
    return new Date(playlistStartDateTime).toISOString();
  } else {
    return new Date(new Date().getTime() + 5 * 60000).toISOString();
  }
};
