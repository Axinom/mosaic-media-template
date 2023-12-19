--! Previous: sha1:035a2ed9bc2b4421de935f14596c3a8f50bf2743
--! Hash: sha1:9165bff5d6292c8db4ed9fa8f23eb336074bcbe6
--! Message: transactional-inbox-outbox

-- transactional inbox table
DROP TABLE IF EXISTS app_hidden.inbox CASCADE;
CREATE TABLE app_hidden.inbox (
  id uuid PRIMARY KEY,
  aggregate_type VARCHAR(255) NOT NULL,
  aggregate_id VARCHAR(255) NOT NULL, 
  message_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  started_attempts smallint NOT NULL DEFAULT 0,
  finished_attempts smallint NOT NULL DEFAULT 0
);
-- only the DB owner can insert (and delete) incoming messages
GRANT SELECT ON app_hidden.inbox TO ":DATABASE_GQL_ROLE";
GRANT UPDATE (started_attempts, finished_attempts, processed_at) ON app_hidden.inbox TO ":DATABASE_GQL_ROLE";

-- transactional outbox table
DROP TABLE IF EXISTS app_hidden.outbox CASCADE;
CREATE TABLE app_hidden.outbox(
  id uuid PRIMARY KEY,
  aggregate_type VARCHAR(255) NOT NULL,
  aggregate_id VARCHAR(255) NOT NULL,
  message_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- owner and GQL DB role can insert outgoing messages (and then delete them which needs also select)
GRANT INSERT, DELETE, SELECT ON app_hidden.outbox TO ":DATABASE_GQL_ROLE";
