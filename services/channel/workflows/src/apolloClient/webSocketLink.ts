import {
  ApolloLink,
  FetchResult,
  Observable,
  Operation,
} from '@apollo/client/core';
import { GraphQLError, print } from 'graphql';
import { Client, ClientOptions, createClient } from 'graphql-ws';

/**
 * This class should've been ideally implemented by Apollo.
 * But since the Apollo WsSocketLink only supports the old `graphql-ws` protocol,
 * we're re-implementing the `WebSocketLink` class to support
 * the new `graphql-transport-ws` protocol.
 * This is taken from the `graphql-ws` library recipe from https://github.com/enisdenjo/graphql-ws#apollo-client.
 *
 * Note to avoid confusion:
 * The library we're using now is named `graphql-ws` and it supports the protocol `graphql-transport-ws`.
 * The previous protocol that is now obsolete is also named `graphql-ws`, but has no relation to the library we're using now.
 *
 * This should be ideally placed in a library.
 */
export class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: observer.next.bind(observer),
          complete: observer.complete.bind(observer),
          error: (err) => {
            if (err instanceof Error) {
              return observer.error(err);
            }

            if (err instanceof CloseEvent) {
              return observer.error(
                // reason will be available on clean closes
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ''}`,
                ),
              );
            }

            return observer.error(
              new Error(
                (err as GraphQLError[])
                  .map(({ message }) => message)
                  .join(', '),
              ),
            );
          },
        },
      );
    });
  }
}
