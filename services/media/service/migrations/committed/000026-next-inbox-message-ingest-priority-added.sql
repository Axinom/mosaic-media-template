--! Previous: sha1:9e58d9212f8204cc42f4e3b3afd0abe7d343bd12
--! Hash: sha1:7f4ccc8d5137091cfb2747dd7f3dfb1bd3ac7117
--! Message: next-inbox-message-ingest-priority-added

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

  -- get 1 oldest not locked priority ingest message, either StartIngest or CheckFinishIngestDocument
  BEGIN
    SELECT *
      INTO message_row
      FROM app_hidden.inbox
      WHERE processed_at IS NULL AND abandoned_at IS NULL AND aggregate_type = 'ingest-document'
      ORDER BY created_at
      LIMIT 1
      FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked
    
    IF FOUND AND message_row.locked_until <= NOW() THEN
      ids := array_append(ids, message_row.id);
    END IF;
  EXCEPTION 
    WHEN lock_not_available THEN
        NULL;
    WHEN serialization_failure THEN
        NULL;
    WHEN OTHERS THEN
        RAISE;
  END;

  -- get (only) the oldest message of every segment but only return it if it is not locked
  FOR loop_row IN
    SELECT * FROM app_hidden.inbox m WHERE m.id in (SELECT DISTINCT ON (segment) id
      FROM app_hidden.inbox
      WHERE processed_at IS NULL AND abandoned_at IS NULL AND id NOT IN (SELECT UNNEST(ids))
      ORDER BY segment, created_at) order by created_at
  LOOP
    BEGIN
      EXIT WHEN cardinality(ids) >= max_size;
    
      SELECT *
        INTO message_row
        FROM app_hidden.inbox
        WHERE id = loop_row.id
        FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked
      
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
          FOR NO KEY UPDATE NOWAIT; -- throw/catch error when locked

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
