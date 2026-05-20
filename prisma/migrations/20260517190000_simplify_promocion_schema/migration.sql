-- Simplifica Promocion para usar solo people/title/description/price/type.

-- Elimina tablas auxiliares que ya no se usan.
DROP TABLE IF EXISTS "PromocionFocaccia";
DROP TABLE IF EXISTS "PedidoPromocion";

-- Elimina índices obsoletos del esquema anterior.
DROP INDEX IF EXISTS "Promocion_isActive_startsAt_endsAt_idx";
DROP INDEX IF EXISTS "Promocion_code_key";

-- Renombra y limpia columnas antiguas.
ALTER TABLE "Promocion" RENAME COLUMN "name" TO "title";

ALTER TABLE "Promocion"
    DROP COLUMN IF EXISTS "code",
    DROP COLUMN IF EXISTS "tipo",
    DROP COLUMN IF EXISTS "value",
    DROP COLUMN IF EXISTS "minQuantity",
    DROP COLUMN IF EXISTS "minOrderAmount",
    DROP COLUMN IF EXISTS "appliesToSize",
    DROP COLUMN IF EXISTS "isActive",
    DROP COLUMN IF EXISTS "startsAt",
    DROP COLUMN IF EXISTS "endsAt",
    DROP COLUMN IF EXISTS "maxUses",
    DROP COLUMN IF EXISTS "usesCount";

ALTER TABLE "Promocion"
    ADD COLUMN "people" INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN "type" TEXT NOT NULL DEFAULT 'combos';

-- El enum viejo deja de ser necesario.
DROP TYPE IF EXISTS "TipoPromocion";
