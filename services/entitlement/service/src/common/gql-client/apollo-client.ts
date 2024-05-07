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

const getAuthLink = (config: Config): ApolloLink => {
  return setContext(async (op, context) => {
    const { headers } = context;
    return {
      headers: {
        ...headers,
      },
    };
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getApolloClient = async (config: Config): Promise<any> => {
  if (client) {
    return client;
  }
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
  const httpUri = String(new URL(`/graphql`, config.catalogServiceBaseUrl));
  const httpLink = createHttpLink({
    uri: httpUri,
  });
  /*const uploadLink = createUploadLink({
    uri: `${config.catalogServiceBaseUrl}/graphql`,
    fetch: customFetch,
  });*/
  client = new ApolloClient({
    link: getAuthLink(config).concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  });
  return client;
};
