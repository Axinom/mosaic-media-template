import { GraphQLClient } from 'graphql-request';
import NodeCache from 'node-cache';
import urljoin from 'url-join';
import { getSdk } from '../../generated/graphql/id';
import { Config } from '../config';

const cache = new NodeCache({ stdTTL: 60 * 5 }); // cache for 5 minutes

/**
 * Checks if the service for the passed serviceId is enabled
 */
export const isManagedServiceEnabled = async (
  serviceId: string,
  { idServiceAuthBaseUrl }: Config,
  authToken: string,
  updateCache = false,
): Promise<boolean> => {
  let enabledServices = cache.get<string[]>('services');
  if (!enabledServices || updateCache) {
    const client = new GraphQLClient(urljoin(idServiceAuthBaseUrl, 'graphql'));
    const { GetEnabledManagedServices } = getSdk(client);
    const { data } = await GetEnabledManagedServices(
      {},
      { Authorization: `Bearer ${authToken}` },
    );
    enabledServices = data.enabledManagedServices.map((x) => x.serviceId);
    cache.set('services', enabledServices, 60 * 5);
  }
  return enabledServices.includes(serviceId);
};
