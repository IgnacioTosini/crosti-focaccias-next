-- AlterTable: make focacciaId nullable in PedidoFocaccia
ALTER TABLE "PedidoFocaccia" ALTER COLUMN "focacciaId" DROP NOT NULL;

-- Drop existing FK constraint (ON DELETE RESTRICT)
ALTER TABLE "PedidoFocaccia" DROP CONSTRAINT "PedidoFocaccia_focacciaId_fkey";

-- Re-add FK constraint with ON DELETE SET NULL
ALTER TABLE "PedidoFocaccia" ADD CONSTRAINT "PedidoFocaccia_focacciaId_fkey"
    FOREIGN KEY ("focacciaId") REFERENCES "Focaccia"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
