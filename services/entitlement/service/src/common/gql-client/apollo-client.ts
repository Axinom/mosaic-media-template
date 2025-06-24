import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  DefaultOptions,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Config } from '../config/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
export let client: any = undefined;

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const getAuthLink = (
  config: Config,
  RequestClientIPHeaders: {
    'X-Client-IP': string | string[] | undefined;
    'X-Real-IP': string | string[] | undefined;
    'X-Forwarded-For': string | string[] | undefined;
  },
): ApolloLink => {
  return setContext(async (op, context) => {
    const { headers } = context;
    return {
      headers: {
        ...headers,
        ...RequestClientIPHeaders,
      },
    };
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getApolloClient = async (
  config: Config,
  RequestClientIPHeaders: {
    'X-Client-IP': string | string[] | undefined;
    'X-Real-IP': string | string[] | undefined;
    'X-Forwarded-For': string | string[] | undefined;
  },
): Promise<any> => {
  const httpUri = String(new URL(`/graphql`, config.catalogServiceBaseUrl));
  const httpLink = createHttpLink({
    uri: httpUri,
  });

  client = new ApolloClient({
    link: getAuthLink(config, RequestClientIPHeaders).concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  });
  return client;
};
