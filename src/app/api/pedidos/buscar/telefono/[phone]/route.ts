import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PedidoFocacciaResponse } from "@/types";

type PedidoPayload = {
    id: number;
    clientPhone: string;
    pedidoFocaccias: PedidoFocacciaResponse[];
    quantity: number;
    totalPrice: number;
    orderDate: string;
};

const pedidoInclude = {
    pedidoFocaccias: {
        select: {
            focacciaId: true,
            cantidad: true,
            focaccia: {
                select: {
                    name: true,
                    description: true,
                    price: true,
                    isVeggie: true,
                    imageUrl: true,
                    imagePublicId: true,
                    featured: true,
                },
            },
        },
    },
} as const;

type PedidoWithRelations = import("@prisma/client").Prisma.PedidoGetPayload<{
    include: typeof pedidoInclude;
}>;

const toPedidoPayload = (pedido: PedidoWithRelations): PedidoPayload => ({
    id: pedido.id,
    clientPhone: pedido.clientPhone,
    pedidoFocaccias: pedido.pedidoFocaccias.map((item) => ({
        focacciaId: item.focacciaId,
        name: item.focaccia.name,
        description: item.focaccia.description,
        price: item.focaccia.price,
        isVeggie: item.focaccia.isVeggie,
        imageUrl: item.focaccia.imageUrl,
        imagePublicId: item.focaccia.imagePublicId,
        featured: item.focaccia.featured,
        cantidad: item.cantidad,
    })),
    quantity: pedido.quantity,
    totalPrice: pedido.totalPrice,
    orderDate: pedido.orderDate.toISOString(),
});

export async function GET(_request: NextRequest, context: { params: Promise<{ phone: string }> }) {
    try {
        const { phone } = await context.params;
        const normalizedPhone = decodeURIComponent(phone).trim();

        if (!normalizedPhone) {
            return NextResponse.json(
                {
                    data: [],
                    message: "Teléfono inválido",
                    success: false,
                },
                { status: 400 }
            );
        }

        const pedidos = await prisma.pedido.findMany({
            where: { clientPhone: normalizedPhone },
            orderBy: { orderDate: "desc" },
            include: pedidoInclude,
        });

        return NextResponse.json({
            data: pedidos.map(toPedidoPayload),
            message: "Pedidos obtenidos correctamente",
            success: true,
        });
    } catch (error) {
        console.error("Error al buscar pedidos por teléfono", error);

        return NextResponse.json(
            {
                data: [],
                message: "No se pudieron obtener los pedidos",
                success: false,
            },
            { status: 500 }
        );
    }
}
