import { PiletApi } from '@axinom/mosaic-portal';
import axios, { AxiosInstance } from 'axios';
import { piletConfig } from '../piletConfig';

export let axiosInstance: AxiosInstance;

export function initializeAxios(app: PiletApi): void {
  // Build the base URL from protocol and host
  const baseURL = `${piletConfig.mediaManagementHttpProtocol}://${piletConfig.mediaManagementHost}`;

  axiosInstance = axios.create({ baseURL });

  // Add interceptor to include auth token in headers
  axiosInstance.interceptors.request.use(async (config) => {
    const token = await app.getToken();
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token?.token.accessToken}`;
    // config.headers[
    //   'Authorization'
    // ] = `cms thaXbeEgk9gSSfgMERKenEMX6KYg9tu547WDdBwRJfPLPVUVPEHsSG6VLW5cCzf4`;
    return config;
  });

  // Add response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.data?.message) {
        error.message = error.response.data.message;
      }
      return Promise.reject(error);
    },
  );
}
