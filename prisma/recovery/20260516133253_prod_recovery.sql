-- One-off production recovery for the failed migration
-- 20260516133253_add_sizes_promos_order_tracking
-- Run this manually against the production Neon database before resolving the migration.

DO $$ BEGIN
    CREATE TYPE "FocacciaSize" AS ENUM ('MEDIANA', 'GRANDE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "PedidoStatus" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "TipoPromocion" AS ENUM ('PORCENTAJE', 'MONTO_FIJO', 'PRECIO_FIJO_COMBO');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Focaccia"
    ADD COLUMN IF NOT EXISTS "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS "largePrice" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "mediumPrice" DOUBLE PRECISION;

UPDATE "Focaccia"
SET "mediumPrice" = COALESCE("mediumPrice", "price"),
    "largePrice" = COALESCE("largePrice", "price")
WHERE "mediumPrice" IS NULL OR "largePrice" IS NULL;

ALTER TABLE "Focaccia"
    ALTER COLUMN "mediumPrice" SET NOT NULL,
    ALTER COLUMN "largePrice" SET NOT NULL;

ALTER TABLE "Pedido"
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "deliveredAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "discountTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "notes" TEXT,
    ADD COLUMN IF NOT EXISTS "orderNumber" TEXT,
    ADD COLUMN IF NOT EXISTS "status" "PedidoStatus" NOT NULL DEFAULT 'PENDIENTE',
    ADD COLUMN IF NOT EXISTS "subtotal" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

UPDATE "Pedido"
SET "orderNumber" = COALESCE("orderNumber", 'LEGACY-' || "id"::text),
    "subtotal" = COALESCE("subtotal", "totalPrice"),
    "updatedAt" = COALESCE("updatedAt", "orderDate")
WHERE "orderNumber" IS NULL OR "subtotal" IS NULL OR "updatedAt" IS NULL;

ALTER TABLE "Pedido"
    ALTER COLUMN "orderNumber" SET NOT NULL,
    ALTER COLUMN "subtotal" SET NOT NULL,
    ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "PedidoFocaccia"
    ADD COLUMN IF NOT EXISTS "lineDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "lineSubtotal" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "lineTotal" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "size" "FocacciaSize",
    ADD COLUMN IF NOT EXISTS "unitPrice" DOUBLE PRECISION;

UPDATE "PedidoFocaccia" AS pf
SET "size" = COALESCE(pf."size", 'MEDIANA'::"FocacciaSize"),
    "unitPrice" = COALESCE(pf."unitPrice", f."price"),
    "lineSubtotal" = COALESCE(pf."lineSubtotal", pf."cantidad" * f."price"),
    "lineTotal" = COALESCE(pf."lineTotal", pf."cantidad" * f."price")
FROM "Focaccia" AS f
WHERE f."id" = pf."focacciaId";

ALTER TABLE "PedidoFocaccia"
    ALTER COLUMN "size" SET NOT NULL,
    ALTER COLUMN "unitPrice" SET NOT NULL,
    ALTER COLUMN "lineSubtotal" SET NOT NULL,
    ALTER COLUMN "lineTotal" SET NOT NULL;

DROP INDEX IF EXISTS "PedidoFocaccia_pedidoId_focacciaId_key";
CREATE INDEX IF NOT EXISTS "PedidoFocaccia_focacciaId_idx" ON "PedidoFocaccia"("focacciaId");
CREATE UNIQUE INDEX IF NOT EXISTS "PedidoFocaccia_pedidoId_focacciaId_size_key" ON "PedidoFocaccia"("pedidoId", "focacciaId", "size");

CREATE UNIQUE INDEX IF NOT EXISTS "Pedido_orderNumber_key" ON "Pedido"("orderNumber");
CREATE INDEX IF NOT EXISTS "Pedido_clientPhone_orderDate_idx" ON "Pedido"("clientPhone", "orderDate");
CREATE INDEX IF NOT EXISTS "Pedido_status_orderDate_idx" ON "Pedido"("status", "orderDate");

CREATE TABLE IF NOT EXISTS "Promocion" (
    "id" SERIAL NOT NULL,
    CONSTRAINT "Promocion_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Promocion"
    ADD COLUMN IF NOT EXISTS "name" TEXT,
    ADD COLUMN IF NOT EXISTS "description" TEXT,
    ADD COLUMN IF NOT EXISTS "code" TEXT,
    ADD COLUMN IF NOT EXISTS "tipo" "TipoPromocion",
    ADD COLUMN IF NOT EXISTS "value" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "minQuantity" INTEGER,
    ADD COLUMN IF NOT EXISTS "minOrderAmount" DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS "appliesToSize" "FocacciaSize",
    ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS "startsAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "endsAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "maxUses" INTEGER,
    ADD COLUMN IF NOT EXISTS "usesCount" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Promocion"
SET "name" = COALESCE("name", 'Promocion ' || "id"::text),
    "tipo" = COALESCE("tipo", 'PORCENTAJE'::"TipoPromocion"),
    "value" = COALESCE("value", 0)
WHERE "name" IS NULL OR "tipo" IS NULL OR "value" IS NULL;

ALTER TABLE "Promocion"
    ALTER COLUMN "name" SET NOT NULL,
    ALTER COLUMN "tipo" SET NOT NULL,
    ALTER COLUMN "value" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Promocion_code_key" ON "Promocion"("code");
CREATE INDEX IF NOT EXISTS "Promocion_isActive_startsAt_endsAt_idx" ON "Promocion"("isActive", "startsAt", "endsAt");

CREATE TABLE IF NOT EXISTS "PedidoPromocion" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "promocionId" INTEGER NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    CONSTRAINT "PedidoPromocion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PedidoPromocion_promocionId_idx" ON "PedidoPromocion"("promocionId");
CREATE UNIQUE INDEX IF NOT EXISTS "PedidoPromocion_pedidoId_promocionId_key" ON "PedidoPromocion"("pedidoId", "promocionId");

CREATE TABLE IF NOT EXISTS "PromocionFocaccia" (
    "id" SERIAL NOT NULL,
    "promocionId" INTEGER NOT NULL,
    "focacciaId" INTEGER NOT NULL,
    CONSTRAINT "PromocionFocaccia_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PromocionFocaccia_promocionId_focacciaId_key" ON "PromocionFocaccia"("promocionId", "focacciaId");

DO $$ BEGIN
    ALTER TABLE "PedidoPromocion"
        ADD CONSTRAINT "PedidoPromocion_pedidoId_fkey"
        FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "PedidoPromocion"
        ADD CONSTRAINT "PedidoPromocion_promocionId_fkey"
        FOREIGN KEY ("promocionId") REFERENCES "Promocion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "PromocionFocaccia"
        ADD CONSTRAINT "PromocionFocaccia_promocionId_fkey"
        FOREIGN KEY ("promocionId") REFERENCES "Promocion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "PromocionFocaccia"
        ADD CONSTRAINT "PromocionFocaccia_focacciaId_fkey"
        FOREIGN KEY ("focacciaId") REFERENCES "Focaccia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Focaccia" DROP COLUMN IF EXISTS "price";
