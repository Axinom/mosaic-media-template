import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { PiletApi, UserToken } from '@axinom/mosaic-portal';
import { CloseCode } from 'graphql-ws';
import { WebSocketLink } from './webSocketLink';

export let client: ApolloClient<Record<string, unknown>>;

export const initializeApolloClient = (
  getToken: PiletApi['getToken'],
  host: string,
  httpProtocol: string,
): void => {
  const httpBaseUrl = `${httpProtocol}://${host}`;
  const httpUri = String(new URL(`/graphql`, httpBaseUrl));

  const wsProtocol = httpProtocol.toLowerCase() === 'http' ? 'ws' : 'wss';
  const wsUri = String(new URL(`/graphql`, `${wsProtocol}://${host}`));
  const httpLink = getHttpLink(getToken, httpUri);
  const wsLink = getWsLink(getToken, wsUri);

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};

function getWsLink(getToken: PiletApi['getToken'], url: string): ApolloLink {
  // the socket close timeout due to token expiry
  let tokenExpiryTimeout: NodeJS.Timeout | null = null;
  let currentToken: UserToken | undefined;
  const wsLink = new WebSocketLink({
    url,
    connectionParams: async () => {
      /**
       * We always get the latest token through getToken(), so no need to explicitly refresh it at this point.
       * Whenever the connection is closed either by the server or the client with code `4403: Forbidden`,
       * the library will automatically retry to establish a new websocket connection using the latest token
       * as given below.
       */
      currentToken = (await getToken())?.token;
      return {
        Authorization: `Bearer ${currentToken?.accessToken}`,
      };
    },
    on: {
      connected: (socket) => {
        // clear timeout on every connect for debouncing the expiry
        if (tokenExpiryTimeout) {
          clearTimeout(tokenExpiryTimeout);
        }

        // If the expiry period of the token is less than 30 seconds, set the timeout explicitly to 30 seconds.
        const expiresInMs =
          currentToken && currentToken.expiresInSeconds >= 30
            ? (currentToken.expiresInSeconds - 30) * 1000
            : 30000;

        // set a token expiry timeout for closing the socket
        // with an `4403: Forbidden` close event indicating
        // that the token expired.
        tokenExpiryTimeout = setTimeout(() => {
          if ((<WebSocket>socket).readyState === WebSocket.OPEN) {
            (<WebSocket>socket).close(
              CloseCode.Forbidden,
              'Timeout Close to Refresh Token.',
            );
          }
        }, expiresInMs); // in ms
      },
    },
  });
  return wsLink;
}

function getHttpLink(getToken: PiletApi['getToken'], uri: string): ApolloLink {
  return getAuthLink(getToken).concat(
    createHttpLink({
      uri,
    }),
  );
}

function getAuthLink(getToken: PiletApi['getToken']): ApolloLink {
  return setContext(async (op, context) => {
    const { headers } = context;
    const token = await getToken();

    let authorizationHeader: string;
    if (token) {
      authorizationHeader = `Bearer ${token.token.accessToken}`;
    } else {
      authorizationHeader = ''; // TODO: Handle scenario when token is not retrieved
    }

    return {
      headers: {
        ...headers,
        Authorization: authorizationHeader,
      },
    };
  });
}
