-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoFocaccia" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "focacciaId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "PedidoFocaccia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PedidoFocaccia_pedidoId_focacciaId_key" ON "PedidoFocaccia"("pedidoId", "focacciaId");

-- AddForeignKey
ALTER TABLE "PedidoFocaccia" ADD CONSTRAINT "PedidoFocaccia_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoFocaccia" ADD CONSTRAINT "PedidoFocaccia_focacciaId_fkey" FOREIGN KEY ("focacciaId") REFERENCES "Focaccia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
