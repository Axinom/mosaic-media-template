/* eslint-disable no-console */
import { Pool } from 'pg';

const sleep = async (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const initializePgPool = async (
  connectionString: string,
): Promise<Pool> => {
  const pgPool = new Pool({ connectionString });

  pgPool.on('error', (err) => {
    throw err;
  });

  let attempts = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await pgPool.query('select true as "Connection test";');
      break;
    } catch (e) {
      attempts++;
      if (attempts <= 30) {
        console.log(`Database is not ready yet (attempt ${attempts})`);
      } else {
        throw e;
      }
      await sleep(1000);
    }
  }
  return pgPool;
};

/**
 * Drops multiple databases and related roles.
 * Uses passed database and role names as a startsWith value to search for databases and roles to drop.
 *
 * e.g. `SELECT datname FROM pg_database WHERE datname LIKE '${baseDbName}%';`
 */
export const dropDatabasesAndRoles = async (
  pgPool: Pool,
  baseDbName: string,
  ...baseRoleNames: string[]
): Promise<void> => {
  const client = await pgPool.connect();
  try {
    //Drop databases
    const databaseNames = await client.query(
      `SELECT datname FROM pg_database WHERE datname LIKE '${baseDbName}%';`,
    );

    for await (const dbToDelete of databaseNames.rows) {
      console.log(`Dropping Database: '${dbToDelete.datname}'`);

      await client.query(
        `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${dbToDelete.datname}';`,
      );
      await client.query(`DROP DATABASE IF EXISTS "${dbToDelete.datname}";`);
    }

    //Drop roles
    for (const baseRoleName of baseRoleNames) {
      const escapedRoleName = baseRoleName.replace(/_/g, '\\_');
      const roleNames = await client.query(
        `SELECT rolname FROM pg_roles WHERE rolname LIKE '${escapedRoleName}%';`,
      );

      for await (const roleToDelete of roleNames.rows) {
        console.log(`Dropping Role: '${roleToDelete.rolname}'`);

        await client.query(`DROP ROLE IF EXISTS ${roleToDelete.rolname};`);
      }
    }
  } finally {
    await client.release();
  }
};

export const runResetQueries = async (
  pgPool: Pool,
  dbName: string,
  dbGqlRole: string,
  dbLogin: string,
  dbLoginPassword: string,
  dbOwner: string,
  dbOwnerPassword: string,
  enableReplication: boolean,
  pgRoot?: string,
): Promise<void> => {
  const client = await pgPool.connect();
  try {
    const commands: string[] = [
      // Drop existing connections to database
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${dbName}';`,

      // RESET database
      `DROP DATABASE IF EXISTS "${dbName}";`,
      `DROP DATABASE IF EXISTS "${dbName}_shadow";`,
      `DROP ROLE IF EXISTS ${dbGqlRole};`,
      `DROP ROLE IF EXISTS ${dbLogin};`,
      `DROP ROLE IF EXISTS ${dbOwner};`,

      // Create a non-superuser user (unlike PostGraphile suggests) because we want to make the development database behave as close to the deployment database as possible. E.g. when deploying to Azure or AWS owner user will never be a superuser.
      `CREATE ROLE ${dbOwner} WITH LOGIN PASSWORD '${dbOwnerPassword}';`,

      // Grant REPLICATION if enabled
      enableReplication ? `ALTER ROLE ${dbOwner} WITH REPLICATION;` : '',

      // This is the no-access role that PostGraphile will run as by default
      `CREATE ROLE ${dbLogin} WITH LOGIN PASSWORD '${dbLoginPassword}' NOINHERIT;`,

      // This is the role that PostGraphile will switch to (from ${DATABASE_LOGIN}) during a GraphQL request
      // Basically, this is a group role
      `CREATE ROLE ${dbGqlRole};`,

      // This enables PostGraphile to switch from ${DATABASE_LOGIN} to ${DATABASE_GQL_ROLE}
      // We say that Login user has a gql role and shares same privileges and grants
      `GRANT ${dbGqlRole} TO ${dbLogin};`,
      // This enables PostGraphile to switch from ${DATABASE_OWNER} to ${DATABASE_GQL_ROLE}
      // This is needed because in some cases we are using owner pool and switch into gql role, and even if we remove such occasions it can still happen in specific cases.
      // When owner is superuser - this is not needed, but in deployed environments and for test databases owner is a regular user and also needs such grant.
      `GRANT ${dbGqlRole} TO ${dbOwner};`,

      // Trying to create a database with a different owner than the user/role that is running the create db query will,
      // fail in Flexible Servers for Postgres servers in Azure. Therefore we grant the `dbOwner` role to the user that runs,
      // the query first.
      pgRoot ? `GRANT ${dbOwner} TO ${pgRoot}` : '',
    ];

    for await (const command of commands) {
      if (command) {
        console.log(`Running Query: '${command}'`);
        await client.query(command);
      }
    }
  } finally {
    client.release();
  }
};
