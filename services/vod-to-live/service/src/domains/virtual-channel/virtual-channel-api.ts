import { Dict, mosaicErrorMappingFactory } from '@axinom/mosaic-service-common';
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
  constructor(
    private virtualChannelApiUrl: string,
    private virtualChannelApiKey?: string,
  ) {}

  /**
   * Retrieve list of all virtual channels.
   */
  public getChannels = async (): Promise<ChannelEntry[]> => {
    try {
      const result = await axios.get<ChannelEntry[]>(
        urljoin(this.virtualChannelApiUrl, 'channels'),
        {
          headers: this.getAuthorizationHeader(),
        },
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
   * Retrieve the complete list of transitions associated with the virtual channel.
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
          {
            headers: this.getAuthorizationHeader(),
          },
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
   * Initiate a job to create a channel or make changes to an existing one.
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
        headers: {
          ...this.getAuthorizationHeader(),
          'Content-Type': 'application/xml',
        },
      });
      return result.data;
    } catch (error) {
      throw getVirtualChannelApiMappedError(error);
    }
  };
  /**
   * Submits a job to create or modify an existing transition for a channel.
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
        headers: {
          ...this.getAuthorizationHeader(),
          'Content-Type': 'application/xml',
        },
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
   * Delete virtual channel.
   * @param channelId - unique identifier for the Channel.
   * @returns - response from the Virtual Channel API.
   */
  public deleteChannel = async (channelId: string): Promise<string> => {
    try {
      const result = await axios.delete<string>(
        urljoin(this.virtualChannelApiUrl, 'channels', channelId),
        {
          headers: this.getAuthorizationHeader(),
        },
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
   * Delete a transition within a channel.
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
        {
          headers: this.getAuthorizationHeader(),
        },
      );
      return result.data;
    } catch (error) {
      throw getVirtualChannelApiMappedError(error);
    }
  };

  /**
   * Retrieve a list of all transitions that have been created for a specific playlist within the virtual channel.
   * @param channelId  - unique identifier for the Channel.
   * @param playlistId - unique identifier for the PLaylist.
   * @returns - response from the Virtual Channel API.
   */
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

  /**
   * Retrieve the current status of a the virtual channel.
   * Includes both the overall status ["Pending", "In Progress", "Success", "Failed"]
   * and a detailed history.
   * @param channelId  - unique identifier for the Channel.
   * @returns - response from the Virtual Channel API.
   */
  public getChannelStatus = async (
    channelId: string,
  ): Promise<ChannelStatusResponse> => {
    try {
      const result = await axios.get<ChannelStatusResponse>(
        urljoin(this.virtualChannelApiUrl, 'channels', channelId, 'status'),
        {
          headers: this.getAuthorizationHeader(),
        },
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

  /**
   * Verifies whether the virtual channel has any associated transitions.
   * @param channelId   - unique identifier for the Channel.
   */
  public channelHasPlaylistTransitions = async (
    channelId: string,
  ): Promise<boolean> => {
    const transitions = await this.getChannelTransitions(channelId);
    return transitions.find((t) => getPlaylistIdHeaderRegex().test(t.smil))
      ? true
      : false;
  };

  private getAuthorizationHeader = (): Dict<string> => {
    if (this.virtualChannelApiKey) {
      return {
        'USP-API-KEY': this.virtualChannelApiKey,
      };
    }

    return {};
  };
}
