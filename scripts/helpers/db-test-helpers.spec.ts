import { getSqlStatementsWithDbName } from './db-test-helpers';

describe('DB test helpers', () => {
  describe('getSqlStatementsWithDbName', () => {
    test('finds one-line statements containing :DB_NAME', () => {
      const fileContents = [
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DATABASE_LOGIN";',
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DB_ENV_OWNER";',
        '-- Create new schema for hidden objects which will never be exposed to postgraphile but ${config.dbGqlRole} will have access to',
        'DROP SCHEMA IF EXISTS app_hidden CASCADE;',
        'CREATE SCHEMA app_hidden;',

        '-- Grant public schema USAGE to ${config.dbGqlRole}',
        'GRANT USAGE ON SCHEMA public, app_public, app_hidden, ax_utils TO ":DATABASE_GQL_ROLE";',
        'ALTER DATABASE ":DB_NAME" SET "search_path" TO "app_public", "ax_utils", "app_hidden", "app_private", "public";',
      ].join('\n');

      const statements = getSqlStatementsWithDbName(fileContents);

      expect(statements).toEqual([
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DATABASE_LOGIN";',
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DB_ENV_OWNER";',
        'ALTER DATABASE ":DB_NAME" SET "search_path" TO "app_public", "ax_utils", "app_hidden", "app_private", "public";',
      ]);
    });

    test('finds multi-line statements containing :DB_NAME', () => {
      const fileContents = [
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DATABASE_LOGIN";',
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DB_ENV_OWNER";',
        '-- Create new schema for hidden objects which will never be exposed to postgraphile but ${config.dbGqlRole} will have access to',
        'DROP SCHEMA IF EXISTS app_hidden CASCADE;',
        'CREATE SCHEMA app_hidden;',

        '-- Grant public schema USAGE to ${config.dbGqlRole}',
        'GRANT USAGE ON SCHEMA public, app_public, app_hidden, ax_utils TO ":DATABASE_GQL_ROLE";',
        `ALTER DATABASE ":DB_NAME"
         SET "search_path"
         TO "app_public",
            "ax_utils",
            "app_hidden",
            "app_private",
            "public";`,
      ].join('\n');

      const statements = getSqlStatementsWithDbName(fileContents);

      expect(statements).toEqual([
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DATABASE_LOGIN";',
        'GRANT CONNECT ON DATABASE ":DB_NAME" TO ":DB_ENV_OWNER";',
        `ALTER DATABASE ":DB_NAME"
         SET "search_path"
         TO "app_public",
            "ax_utils",
            "app_hidden",
            "app_private",
            "public";`,
      ]);
    });
  });
});
