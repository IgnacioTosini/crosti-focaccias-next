-- One-off production recovery for the failed migration
-- 20260517150312
-- Run this manually against the production Neon database before resolving the migration.

UPDATE "Promocion"
SET "description" = COALESCE("description", '')
WHERE "description" IS NULL;

ALTER TABLE "Promocion"
    ALTER COLUMN "description" SET NOT NULL;