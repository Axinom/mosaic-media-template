--! Previous: sha1:c9457b917399b9a43ac0fc04d0e130cf728bfcb7
--! Hash: sha1:a588014c99783319a56e38380e970b4877d2257c
--! Message: transactional-outbox-inbox

-- ____  _  _  ___   ___  __  __
-- |_ _|| \| || _ ) / _ \ \ \/ /
--  | | | .  || _ \| (_) | >  < 
-- |___||_|\_||___/ \___/ /_/\_\
 
DROP TABLE IF EXISTS app_hidden.inbox CASCADE;
CREATE TABLE app_hidden.inbox (
  id uuid PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  segment TEXT,
  concurrency TEXT NOT NULL DEFAULT 'sequential',
  payload JSONB NOT NULL,
  metadata JSONB,
  locked_until TIMESTAMPTZ NOT NULL DEFAULT to_timestamp(0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  processed_at TIMESTAMPTZ,
  abandoned_at TIMESTAMPTZ,
  started_attempts smallint NOT NULL DEFAULT 0,
  finished_attempts smallint NOT NULL DEFAULT 0
);
ALTER TABLE app_hidden.inbox ADD CONSTRAINT inbox_concurrency_check
  CHECK (concurrency IN ('sequential', 'parallel'));

GRANT SELECT, INSERT, DELETE ON app_hidden.inbox TO :DATABASE_GQL_ROLE;
GRANT UPDATE (locked_until, processed_at, abandoned_at, started_attempts, finished_attempts) ON app_hidden.inbox TO :DATABASE_GQL_ROLE;
GRANT SELECT, INSERT, UPDATE, DELETE ON app_hidden.inbox TO :DB_OWNER;


-- Create the function to get the next batch of messages from the inbox table.
DROP FUNCTION IF EXISTS app_hidden.next_inbox_messages(integer, integer);
CREATE OR REPLACE FUNCTION app_hidden.next_inbox_messages(
  max_size integer, lock_ms integer)
    RETURNS SETOF app_hidden.inbox 
    LANGUAGE 'plpgsql'

AS $BODY$
DECLARE 
  loop_row app_hidden.inbox%ROWTYPE;
  message_row app_hidden.inbox%ROWTYPE;
  ids uuid[] := '{}';
BEGIN

  IF max_size < 1 THEN
    RAISE EXCEPTION 'The max_size for the next messages batch must be at least one.' using errcode = 'MAXNR';
  END IF;

  -- get (only) the oldest message of every segment but only return it if it is not locked
  FOR loop_row IN
    SELECT * FROM app_hidden.inbox m WHERE m.id in (SELECT DISTINCT ON (segment) id
      FROM app_hidden.inbox
      WHERE processed_at IS NULL AND abandoned_at IS NULL
      ORDER BY segment, created_at) order by created_at
  LOOP
    BEGIN
      EXIT WHEN cardinality(ids) >= max_size;
    
      SELECT *
        INTO message_row
        FROM app_hidden.inbox
        WHERE id = loop_row.id
        FOR NO KEY UPDATE NOWAIT;-- throw/catch error when locked
      
      IF message_row.locked_until > NOW() THEN
        CONTINUE;
      END IF;
      
      ids := array_append(ids, message_row.id);
    EXCEPTION 
      WHEN lock_not_available THEN
        CONTINUE;
      WHEN serialization_failure THEN
        CONTINUE;
    END;
  END LOOP;
  
  -- if max_size not reached: get the oldest parallelizable message independent of segment
  IF cardinality(ids) < max_size THEN
    FOR loop_row IN
      SELECT * FROM app_hidden.inbox
        WHERE concurrency = 'parallel' AND processed_at IS NULL AND abandoned_at IS NULL AND locked_until < NOW() 
          AND id NOT IN (SELECT UNNEST(ids))
        order by created_at
    LOOP
      BEGIN
        EXIT WHEN cardinality(ids) >= max_size;

        SELECT *
          INTO message_row
          FROM app_hidden.inbox
          WHERE id = loop_row.id
          FOR NO KEY UPDATE NOWAIT;-- throw/catch error when locked

        ids := array_append(ids, message_row.id);
      EXCEPTION 
        WHEN lock_not_available THEN
          CONTINUE;
        WHEN serialization_failure THEN
          CONTINUE;
      END;
    END LOOP;
  END IF;
  
  -- set a short lock value so the the workers can each process a message
  IF cardinality(ids) > 0 THEN

    RETURN QUERY 
      UPDATE app_hidden.inbox
        SET locked_until = clock_timestamp() + (lock_ms || ' milliseconds')::INTERVAL, started_attempts = started_attempts + 1
        WHERE ID = ANY(ids)
        RETURNING *;

  END IF;
END;
$BODY$;

SELECT ax_define.define_index('segment', 'inbox', 'app_hidden');
SELECT ax_define.define_index('created_at', 'inbox', 'app_hidden');
SELECT ax_define.define_index('processed_at', 'inbox', 'app_hidden');
SELECT ax_define.define_index('abandoned_at', 'inbox', 'app_hidden');
SELECT ax_define.define_index('locked_until', 'inbox', 'app_hidden');
