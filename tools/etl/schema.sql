-- Entity-resolution schema for the ETL pipeline.
-- Runnable directly:  psql "$DATABASE_URL" -f tools/etl/schema.sql
--
-- The parameterised upsert that writes these tables lives in upsert.sql
-- (it is executed by the app with bound $1..$5 params, not by psql).

CREATE TABLE IF NOT EXISTS entity (
  entity_hash  text        PRIMARY KEY,           -- unique global key (e.g. sha256 of the identity)
  canonical    jsonb       NOT NULL DEFAULT '{}', -- merged golden-record fields
  trust_score  integer     NOT NULL DEFAULT 0,    -- # of independent sources corroborating
  source_count integer     NOT NULL DEFAULT 0,    -- kept in step with trust_score
  first_seen   timestamptz NOT NULL DEFAULT now(),
  last_seen    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entity_source (
  entity_hash   text        NOT NULL REFERENCES entity(entity_hash) ON DELETE CASCADE,
  source_system text        NOT NULL,             -- which independent system asserted this
  source_id     text        NOT NULL,             -- record id within that system
  payload       jsonb       NOT NULL DEFAULT '{}',
  first_seen    timestamptz NOT NULL DEFAULT now(),
  last_seen     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_hash, source_system, source_id)   -- idempotency key
);

CREATE INDEX IF NOT EXISTS entity_source_by_entity ON entity_source (entity_hash);
