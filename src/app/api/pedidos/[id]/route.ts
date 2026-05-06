import { Prisma } from "@prisma/client";
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

const parseId = (value: string) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const pedidoId = parseId(id);

        if (!pedidoId) {
            return NextResponse.json(
                {
                    data: null,
                    message: "ID de pedido inválido",
                    success: false,
                },
                { status: 400 }
            );
        }

        const pedido = await prisma.pedido.findUnique({
            where: { id: pedidoId },
            include: pedidoInclude,
        });

        if (!pedido) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Pedido no encontrado",
                    success: false,
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: toPedidoPayload(pedido),
            message: "Pedido obtenido correctamente",
            success: true,
        });
    } catch (error) {
        console.error("Error al obtener pedido", error);

        return NextResponse.json(
            {
                data: null,
                message: "No se pudo obtener el pedido",
                success: false,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const pedidoId = parseId(id);

        if (!pedidoId) {
            return NextResponse.json(
                {
                    data: null,
                    message: "ID de pedido inválido",
                    success: false,
                },
                { status: 400 }
            );
        }

        const deletedPedido = await prisma.pedido.delete({
            where: { id: pedidoId },
            include: pedidoInclude,
        });

        return NextResponse.json({
            data: toPedidoPayload(deletedPedido),
            message: "Pedido eliminado correctamente",
            success: true,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json(
                {
                    data: null,
                    message: "Pedido no encontrado",
                    success: false,
                },
                { status: 404 }
            );
        }

        console.error("Error al eliminar pedido", error);

        return NextResponse.json(
            {
                data: null,
                message: "No se pudo eliminar el pedido",
                success: false,
            },
            { status: 500 }
        );
    }
}
