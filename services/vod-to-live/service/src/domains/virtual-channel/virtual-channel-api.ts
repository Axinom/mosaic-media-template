import { mosaicErrorMappingFactory } from '@axinom/mosaic-service-common';
import axios, { AxiosError } from 'axios';
import urljoin from 'url-join';
import { getPlaylistIdHeaderRegex, Transition } from '../live-stream/utils';
import {
  ChannelEntry,
  ChannelResponse,
  ChannelStatusResponse,
  ChannelTransitionResponse,
} from './virtual-channel-api-models';

const getVirtualChannelApiMappedError = mosaicErrorMappingFactory(
  (
    error: Error & {
      response?: {
        status?: unknown;
        data?: unknown;
      };
    },
  ) => {
    return {
      message: error.message,
      code: 'VIRTUAL_CHANNEL_API_ERROR',
      details: {
        status: error?.response?.status,
        data: error?.response?.data,
      },
    };
  },
);

export class VirtualChannelApi {
  constructor(private virtualChannelApiUrl: string) {}

  /**
   * Retrieve list of all virtual channels.
   */
  public getChannels = async (): Promise<ChannelEntry[]> => {
    try {
      const result = await axios.get<ChannelEntry[]>(
        urljoin(this.virtualChannelApiUrl, 'channels'),
      );
      return result.data;
    } catch (error) {
      const errorCode = (error as AxiosError)?.response?.status;
      if (errorCode === 404) {
        // No channels are currently registered.
        return [];
      }
      throw getVirtualChannelApiMappedError(error);
    }
  };

  /**
   * Retrieve list of all transitions for the virtual channel.
   * @param channelId - unique identifier for the Channel.
   */
  public getChannelTransitions = async (
    channelId: string,
  ): Promise<Transition[]> => {
    try {
      const response = (
        await axios.get<ChannelTransitionResponse>(
          urljoin(
            this.virtualChannelApiUrl,
            'channels',
            channelId,
            'transitions',
          ),
        )
      ).data;
      const result: Transition[] = [];
      for (const transitionDate in response.transitions) {
        const transitionEntry = response.transitions[transitionDate];
        result.push({ ...transitionEntry, transitionDate });
      }

      return result;
    } catch (error) {
      const errorCode = (error as AxiosError)?.response?.status;
      if (errorCode === 404) {
        return [];
      }
      throw getVirtualChannelApiMappedError(error);
    }
  };

  /**
   * Submit a job to create a channel or to modify existing one.
   * @param channelId - unique identifier for the Channel.
   * @param smil - SMIL for the Channel.
   * @param forceUpdate - forces an update on the active channel. USE WITH CAUTION: can break playout.
   */
  public putChannel = async (
    channelId: string,
    smil: string,
    forceUpdate?: boolean,
  ): Promise<ChannelResponse> => {
    try {
      const url = new URL(
        urljoin(this.virtualChannelApiUrl, 'channels', channelId),
      );
      if (forceUpdate) {
        url.searchParams.append('force', 'true');
      }

      const result = await axios.put<ChannelResponse>(url.href, smil, {
        headers: { 'Content-Type': 'application/xml' },
      });
      return result.data;
    } catch (error) {
      throw getVirtualChannelApiMappedError(error);
    }
  };
  /**
   * Submits a job to create a transition or to modify an existing one.
   * @param channelId - unique identifier for the Channel.
   * @param transition - transition - date time a ISO8601 format.
   * @param smil - SMIL for the Playlist.
   * @param forceUpdate - forces an update on the active transition. USE WITH CAUTION: can break playout.
   */
  public putTransition = async (
    channelId: string,
    transition: string,
    smil: string,
    forceUpdate?: boolean,
  ): Promise<ChannelResponse> => {
    try {
      const url = new URL(
        urljoin(
          this.virtualChannelApiUrl,
          'channels',
          channelId,
          'transitions',
          transition,
        ),
      );
      if (forceUpdate) {
        url.searchParams.append('force', 'true');
      }
      const result = await axios.put<ChannelResponse>(url.href, smil, {
        headers: { 'Content-Type': 'application/xml' },
      });
      return result.data;
    } catch (error) {
      const axiosErrorResponse = (error as AxiosError)?.response;
      const errorCode = axiosErrorResponse?.status;
      if (errorCode === 404) {
        return {
          task_id: '',
          status_url: '',
          errorMessage:
            axiosErrorResponse?.data?.detail ??
            `Channel ${channelId} was not found!`,
        };
      }
      throw getVirtualChannelApiMappedError(error);
    }
  };

  /**
   * Delete virtual channel associated with the unique identifier.
   * @param channelId - unique identifier for the Channel.
   * @returns - response from the Virtual Channel API.
   */
  public deleteChannel = async (channelId: string): Promise<string> => {
    try {
      const result = await axios.delete<string>(
        urljoin(this.virtualChannelApiUrl, 'channels', channelId),
      );
      return result.data;
    } catch (error) {
      const axiosErrorResponse = (error as AxiosError)?.response;
      const errorCode = axiosErrorResponse?.status;
      if (errorCode === 404) {
        return (
          axiosErrorResponse?.data?.detail ??
          `Channel ${channelId} was not found!`
        );
      }
      throw getVirtualChannelApiMappedError(error);
    }
  };

  /**
   * Delete transition within channel.
   * @param channelId  - unique identifier for the Channel.
   * @param transition - - transition - date time a ISO8601 format.
   * @returns - response from the Virtual Channel API.
   */
  public deleteTransition = async (
    channelId: string,
    transition: string,
  ): Promise<string> => {
    try {
      const result = await axios.delete<string>(
        urljoin(
          this.virtualChannelApiUrl,
          'channels',
          channelId,
          'transitions',
          transition,
        ),
      );
      return result.data;
    } catch (error) {
      throw getVirtualChannelApiMappedError(error);
    }
  };

  public getPlaylistTransitions = async (
    channelId: string,
    playlistId: string,
  ): Promise<Transition[]> => {
    const transitions = await this.getChannelTransitions(channelId);
    const matchingTransitions: Transition[] = [];
    for (const transition of transitions) {
      if (getPlaylistIdHeaderRegex(playlistId).test(transition.smil)) {
        matchingTransitions.push(transition);
      }
    }
    return matchingTransitions;
  };

  public getChannelStatus = async (
    channelId: string,
  ): Promise<ChannelStatusResponse> => {
    try {
      const result = await axios.get<ChannelStatusResponse>(
        urljoin(this.virtualChannelApiUrl, 'channels', channelId, 'status'),
      );
      return result.data;
    } catch (error) {
      const axiosErrorResponse = (error as AxiosError)?.response;
      const errorCode = axiosErrorResponse?.status;
      if (errorCode === 404) {
        return {
          status: 'Failed',
          origin_url: '',
          details: [
            {
              name: 'Retrieve channel status',
              status: 'Failed',
              time: new Date().toISOString(),
              details:
                axiosErrorResponse?.data?.detail ??
                `Channel ${channelId} was not found!`,
            },
          ],
        };
      }
      throw getVirtualChannelApiMappedError(error);
    }
  };

  public channelHasPlaylistTransitions = async (
    channelId: string,
  ): Promise<boolean> => {
    const transitions = await this.getChannelTransitions(channelId);
    return transitions.find((t) => getPlaylistIdHeaderRegex().test(t.smil))
      ? true
      : false;
  };
}
