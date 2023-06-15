import { OwnerPgPool } from '@axinom/mosaic-db-common';
import { EndUserAuthenticationContext } from '@axinom/mosaic-id-guard';
import { assertObjectHasProperties } from '@axinom/mosaic-service-common';
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

export function getValidatedExtendedContext(
  value: unknown,
): Required<ExtendedGraphQLContext> {
  assertObjectHasProperties<Required<ExtendedGraphQLContext>>(
    value,
    ['config', 'ownerPool', 'jwtToken', 'pgRole', 'pgClient', 'subject'],
    'GraphQL context',
  );
  return value;
}
