/*
  Warnings:

  - You are about to drop the column `price` on the `Focaccia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pedidoId,focacciaId,size]` on the table `PedidoFocaccia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `largePrice` to the `Focaccia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediumPrice` to the `Focaccia` table without a default value. This is not possible if the table is not empty.
  - The required column `orderNumber` was added to the `Pedido` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `subtotal` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineSubtotal` to the `PedidoFocaccia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineTotal` to the `PedidoFocaccia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `PedidoFocaccia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `PedidoFocaccia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FocacciaSize" AS ENUM ('MEDIANA', 'GRANDE');

-- CreateEnum
CREATE TYPE "PedidoStatus" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoPromocion" AS ENUM ('PORCENTAJE', 'MONTO_FIJO', 'PRECIO_FIJO_COMBO');

-- DropIndex
DROP INDEX "PedidoFocaccia_pedidoId_focacciaId_key";

-- AlterTable
ALTER TABLE "Focaccia" DROP COLUMN "price",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "largePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mediumPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "discountTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "status" "PedidoStatus" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PedidoFocaccia" ADD COLUMN     "lineDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "lineSubtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lineTotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "size" "FocacciaSize" NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Promocion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "tipo" "TipoPromocion" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "minQuantity" INTEGER,
    "minOrderAmount" DOUBLE PRECISION,
    "appliesToSize" "FocacciaSize",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "usesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promocion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoPromocion" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "promocionId" INTEGER NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "PedidoPromocion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromocionFocaccia" (
    "id" SERIAL NOT NULL,
    "promocionId" INTEGER NOT NULL,
    "focacciaId" INTEGER NOT NULL,

    CONSTRAINT "PromocionFocaccia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promocion_code_key" ON "Promocion"("code");

-- CreateIndex
CREATE INDEX "Promocion_isActive_startsAt_endsAt_idx" ON "Promocion"("isActive", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "PedidoPromocion_promocionId_idx" ON "PedidoPromocion"("promocionId");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoPromocion_pedidoId_promocionId_key" ON "PedidoPromocion"("pedidoId", "promocionId");

-- CreateIndex
CREATE UNIQUE INDEX "PromocionFocaccia_promocionId_focacciaId_key" ON "PromocionFocaccia"("promocionId", "focacciaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_orderNumber_key" ON "Pedido"("orderNumber");

-- CreateIndex
CREATE INDEX "Pedido_clientPhone_orderDate_idx" ON "Pedido"("clientPhone", "orderDate");

-- CreateIndex
CREATE INDEX "Pedido_status_orderDate_idx" ON "Pedido"("status", "orderDate");

-- CreateIndex
CREATE INDEX "PedidoFocaccia_focacciaId_idx" ON "PedidoFocaccia"("focacciaId");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoFocaccia_pedidoId_focacciaId_size_key" ON "PedidoFocaccia"("pedidoId", "focacciaId", "size");

-- AddForeignKey
ALTER TABLE "PedidoPromocion" ADD CONSTRAINT "PedidoPromocion_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoPromocion" ADD CONSTRAINT "PedidoPromocion_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "Promocion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocionFocaccia" ADD CONSTRAINT "PromocionFocaccia_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "Promocion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocionFocaccia" ADD CONSTRAINT "PromocionFocaccia_focacciaId_fkey" FOREIGN KEY ("focacciaId") REFERENCES "Focaccia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
