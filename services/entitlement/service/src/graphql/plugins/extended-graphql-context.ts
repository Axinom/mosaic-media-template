import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { EndUserAuthenticationContext } from '@axinom/mosaic-id-guard';
import { Client } from 'pg';
import { Config } from '../../common';

export interface ExtendedGraphQLContext extends EndUserAuthenticationContext {
  config: Config;
  ownerPool: OwnerPgPool;
  clientIpAddress: string;
  jwtToken?: string;
  pgRole?: string; // set from PostGraphile
  pgClient?: Client; // set from PostGraphile
}
