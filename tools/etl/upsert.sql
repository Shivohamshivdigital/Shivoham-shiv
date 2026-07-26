-- Idempotent entity-resolution upsert for the ETL pipeline.
--
-- Design: an entity is keyed by a single global unique hash. Every ingestion
-- from an independent source is recorded once (idempotent per source), and the
-- entity's trust_score counts *distinct corroborating sources* — re-submitting
-- the same source never inflates it. Normalised metadata is merged into the
-- golden record; full per-source payloads are kept for provenance and un-merge.

-- ---------------------------------------------------------------------------
-- Schema
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS entity (
  entity_hash  text        PRIMARY KEY,          -- unique global key (e.g. sha256 of the identity)
  canonical    jsonb       NOT NULL DEFAULT '{}',-- merged golden-record fields
  trust_score  integer     NOT NULL DEFAULT 0,   -- # of independent sources corroborating
  source_count integer     NOT NULL DEFAULT 0,   -- kept in step with trust_score
  first_seen   timestamptz NOT NULL DEFAULT now(),
  last_seen    timestamptz NOT NULL DEFAULT now()
);

-- The linked metadata relation: one immutable row per (entity, source, record).
-- This is the normalised alternative to a jsonb array; see the array variant
-- at the bottom if you prefer denormalised storage.
CREATE TABLE IF NOT EXISTS entity_source (
  entity_hash   text        NOT NULL REFERENCES entity(entity_hash) ON DELETE CASCADE,
  source_system text        NOT NULL,            -- which independent system asserted this
  source_id     text        NOT NULL,            -- record id within that system
  payload       jsonb       NOT NULL DEFAULT '{}',
  first_seen    timestamptz NOT NULL DEFAULT now(),
  last_seen     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_hash, source_system, source_id)   -- idempotency key
);

CREATE INDEX IF NOT EXISTS entity_source_by_entity ON entity_source (entity_hash);

-- ---------------------------------------------------------------------------
-- The upsert (single statement, atomic)
--
-- Params: $1 entity_hash, $2 source_system, $3 source_id, $4 payload::jsonb,
--         $5 canonical::jsonb
-- ---------------------------------------------------------------------------

WITH incoming AS (
  SELECT $1::text  AS entity_hash,
         $2::text  AS source_system,
         $3::text  AS source_id,
         $4::jsonb AS payload,
         $5::jsonb AS canonical
),
-- 1) Record this source's assertion. Idempotent per (entity, source, record):
--    a repeat submission from the SAME source updates the payload but is not
--    new corroboration. `xmax = 0` is true only when a brand-new row was
--    inserted (Postgres idiom for "did this ON CONFLICT insert vs update?").
src AS (
  INSERT INTO entity_source AS es
        (entity_hash, source_system, source_id, payload, first_seen, last_seen)
  SELECT entity_hash, source_system, source_id, payload, now(), now()
  FROM incoming
  ON CONFLICT (entity_hash, source_system, source_id) DO UPDATE
    SET payload   = EXCLUDED.payload,
        last_seen = now()
  RETURNING (xmax = 0) AS is_new_source
)
-- 2) Upsert the entity. On first insert trust_score = 1 (one source). On a
--    conflict, bump the counter ONLY when a new independent source corroborated.
INSERT INTO entity AS e
      (entity_hash, canonical, trust_score, source_count, first_seen, last_seen)
SELECT entity_hash, canonical, 1, 1, now(), now()
FROM incoming
ON CONFLICT (entity_hash) DO UPDATE
  SET canonical    = e.canonical || EXCLUDED.canonical,   -- shallow merge, newest wins per key
      last_seen    = now(),
      trust_score  = e.trust_score  + CASE WHEN (SELECT is_new_source FROM src) THEN 1 ELSE 0 END,
      source_count = e.source_count + CASE WHEN (SELECT is_new_source FROM src) THEN 1 ELSE 0 END
RETURNING e.entity_hash, e.trust_score, e.source_count;

-- ---------------------------------------------------------------------------
-- Reading the resolved entity with its corroborating sources
-- ---------------------------------------------------------------------------

-- SELECT e.entity_hash, e.canonical, e.trust_score,
--        jsonb_agg(jsonb_build_object(
--          'source_system', s.source_system,
--          'source_id',     s.source_id,
--          'last_seen',     s.last_seen
--        ) ORDER BY s.last_seen DESC) AS sources
-- FROM entity e
-- JOIN entity_source s USING (entity_hash)
-- WHERE e.entity_hash = $1
-- GROUP BY e.entity_hash;

-- ---------------------------------------------------------------------------
-- Array variant (denormalised): keep distinct source keys in a jsonb array on
-- `entity` instead of a linked table. Use when you do not need per-source rows.
--
--   ALTER TABLE entity ADD COLUMN sources jsonb NOT NULL DEFAULT '[]';
--
--   INSERT INTO entity AS e (entity_hash, canonical, sources, trust_score)
--   VALUES ($1, $5, jsonb_build_array($2 || ':' || $3), 1)
--   ON CONFLICT (entity_hash) DO UPDATE
--     SET canonical   = e.canonical || EXCLUDED.canonical,
--         -- append only if this source key is not already present:
--         sources     = CASE WHEN e.sources @> EXCLUDED.sources
--                            THEN e.sources
--                            ELSE e.sources || EXCLUDED.sources END,
--         trust_score = e.trust_score
--                       + CASE WHEN e.sources @> EXCLUDED.sources THEN 0 ELSE 1 END;
