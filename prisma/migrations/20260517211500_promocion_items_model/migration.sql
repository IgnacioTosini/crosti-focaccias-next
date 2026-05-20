-- Estructura promociones con tipo tipado y detalle de items por card/combo.

CREATE TYPE "PromocionType" AS ENUM ('FOCACCIAS', 'PREPIZZAS', 'COMBOS');
CREATE TYPE "PromocionItemType" AS ENUM ('FOCACCIA', 'PREPIZZA', 'EXTRA');

ALTER TABLE "Promocion"
    ALTER COLUMN "type" DROP DEFAULT,
    ALTER COLUMN "type" TYPE "PromocionType"
    USING (
        CASE
            WHEN UPPER("type") = 'FOCACCIAS' THEN 'FOCACCIAS'::"PromocionType"
            WHEN UPPER("type") = 'PREPIZZAS' THEN 'PREPIZZAS'::"PromocionType"
            ELSE 'COMBOS'::"PromocionType"
        END
    ),
    ALTER COLUMN "type" SET DEFAULT 'COMBOS';

CREATE TABLE "PromocionItem" (
    "id" SERIAL NOT NULL,
    "promocionId" INTEGER NOT NULL,
    "itemType" "PromocionItemType" NOT NULL,
    "label" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "size" "FocacciaSize",
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PromocionItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PromocionItem_promocionId_idx" ON "PromocionItem"("promocionId");

ALTER TABLE "PromocionItem"
    ADD CONSTRAINT "PromocionItem_promocionId_fkey"
    FOREIGN KEY ("promocionId") REFERENCES "Promocion"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
