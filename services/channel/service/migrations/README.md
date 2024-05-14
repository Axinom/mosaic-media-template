## Development workflow with migrations

- write your SQL migration code into `ROOT/migrations/current.sql` file.
  Alternatively, it is possible when working on the initial or large change to
  use `/current` folder to split the work into multiple files.
- start the app with e.g. `yarn start`
  - When in DEV mode (NODE_ENV=development) - graphile-migrate `watch` command
    is executed
    - This applies all unapplied committed migrations from
      `ROOT/migrations/committed` folder **and watches current.sql, re-running
      its contents on any change.**
    - combined with `pgWatch=true` parameter of PostGraphile, you can test your
      SQL migrations code while the app is running (which looks cool!)
  - When not in DEV mode (NODE_ENV is anything other than development) -
    graphile-migrate `migrate` command is executed.
    - This applies all unapplied committed migrations from
      `ROOT/migrations/committed` folder
- Make adjustments to current.sql while the app is running or is stopped and
  test the migration SQL.
  - It is **highly** advised to write idempotent SQL migrations.
  - See this for more https://github.com/graphile/migrate#idempotency
- When you are happy with the migration code (ideally just before merging it to
  the master branch)- run `yarn run db:commit` command to commit your
  current.sql migration code.
- if you have committed your migration, but feel like you should make more
  adjustments to it - run `yarn run db:uncommit` to undo the commit and move
  previously committed SQL migration back to the current.sql file.
  - see `ROOT/scripts/README.md` for more info on the commands
- if you feel like your migration experimentation irreversibly corrupted your
  database (or you just want a fresh start) - run `yarn run db:reset`
- Let's say that 2 developers are working on two different feature branches,
  both have some changes in current.sql, and developer 1 merges his code into
  master:
  - Developer 1 committed his migration before the merge, so current.sql file in
    the master is empty
    - If not, Developer 1 needs to read documentation and never merge
      uncommitted migrations to master
  - Developer 2 can safely merge changes from the master into his current branch
    (unless there are some conflicts in other files that he/she has to resolve)
    - If Developer 2 already committed his current.sql changes, he/she has to
      run `yarn run db:uncommit` to move the changes back to current.sql After
      the merge, Developer 2 needs to make sure that his migration SQL (in
      current.sql) is compatible with a new committed migration which Developer
      1 introduced.
  - If changes are compatible - Developer 1 can run the app to test that and
    then commit his migration (on top of the migration that Developer 1
    introduced)
  - If changes are incompatible - Developer 1 has to make adjustments in his own
    migration SQL (in current.sql) and then test/commit his migration.
    - Because changes from Developer 2 are already applied to the database, it
      might be impossible or problematic to write an "undo" migration SQL.
    - In this case, re-creating the development database from scratch using
      `yarn run db:reset` might be a better option
