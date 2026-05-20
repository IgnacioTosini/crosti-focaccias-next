import { Prisma } from "@prisma/client";
import type { Pedido, PedidoFocacciaResponse } from "@/types";

export const pedidoInclude = {
    pedidoFocaccias: {
        select: {
            focacciaId: true,
            size: true,
            unitPrice: true,
            lineSubtotal: true,
            lineDiscount: true,
            lineTotal: true,
            cantidad: true,
            focaccia: {
                select: {
                    name: true,
                    description: true,
                    mediumPrice: true,
                    largePrice: true,
                    isVeggie: true,
                    imageUrl: true,
                    imagePublicId: true,
                    featured: true,
                },
            },
        },
    },
} as const;

export type PedidoWithRelations = Prisma.PedidoGetPayload<{
    include: typeof pedidoInclude;
}>;

type PedidoFocacciaItem = PedidoWithRelations["pedidoFocaccias"][number];
type ActivePedidoFocacciaItem = PedidoFocacciaItem & {
    focacciaId: number;
    focaccia: NonNullable<PedidoFocacciaItem["focaccia"]>;
};

const hasActiveFocaccia = (item: PedidoFocacciaItem): item is ActivePedidoFocacciaItem =>
    item.focacciaId !== null && item.focaccia !== null;

const toPedidoFocacciaPayload = (
    item: ActivePedidoFocacciaItem
): PedidoFocacciaResponse => ({
    focacciaId: item.focacciaId,
    name: item.focaccia.name,
    description: item.focaccia.description,
    mediumPrice: item.focaccia.mediumPrice,
    largePrice: item.focaccia.largePrice,
    price: item.unitPrice,
    size: item.size,
    unitPrice: item.unitPrice,
    lineSubtotal: item.lineSubtotal,
    lineDiscount: item.lineDiscount,
    lineTotal: item.lineTotal,
    isVeggie: item.focaccia.isVeggie,
    imageUrl: item.focaccia.imageUrl,
    imagePublicId: item.focaccia.imagePublicId,
    featured: item.focaccia.featured,
    cantidad: item.cantidad,
});

export const toPedidoPayload = (pedido: PedidoWithRelations): Pedido => ({
    id: pedido.id,
    orderNumber: pedido.orderNumber,
    clientPhone: pedido.clientPhone,
    status: pedido.status,
    pedidoFocaccias: pedido.pedidoFocaccias
        .filter(hasActiveFocaccia)
        .map(toPedidoFocacciaPayload),
    quantity: pedido.quantity,
    subtotal: pedido.subtotal,
    discountTotal: pedido.discountTotal,
    totalPrice: pedido.totalPrice,
    orderDate: pedido.orderDate.toISOString(),
});
