import { PgClass, PgConstraint } from 'graphile-build-pg';

export function getPkName(table: PgClass): string {
  const tablePk = table.primaryKeyConstraint as PgConstraint;
  return tablePk.keyAttributes[0].name;
}
