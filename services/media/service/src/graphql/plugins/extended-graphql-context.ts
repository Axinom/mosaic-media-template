import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { ManagementAuthenticationContext } from '@axinom/mosaic-id-guard';
import { Broker } from '@axinom/mosaic-message-bus';
import { WebSocket } from 'graphql-ws';
import { Client } from 'pg';
import {
  AtomicMutationRequest,
  MutationAtomicityContext,
} from 'postgraphile-plugin-atomic-mutations';
import { Config } from '../../common';

export interface ExtendedGraphQLContext
  extends ManagementAuthenticationContext,
    Partial<AtomicMutationRequest> {
  config: Config;
  mutationAtomicityContext?: MutationAtomicityContext;
  messagingBroker: Broker;
  ownerPool: OwnerPgPool;
  jwtToken?: string;
  pgRole?: string; // set from PostGraphile
  pgClient?: Client; // set from PostGraphile
  websocket?: WebSocket;
}
