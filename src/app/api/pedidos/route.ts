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

const toPedidoPayload = (pedido: PedidoWithRelations): PedidoPayload => {
    const items = pedido.pedidoFocaccias.map((item) => ({
        focacciaId: item.focacciaId,
        name: item.focaccia.name,
        description: item.focaccia.description,
        price: item.focaccia.price,
        isVeggie: item.focaccia.isVeggie,
        imageUrl: item.focaccia.imageUrl,
        imagePublicId: item.focaccia.imagePublicId,
        featured: item.focaccia.featured,
        cantidad: item.cantidad,
    }));

    return {
        id: pedido.id,
        clientPhone: pedido.clientPhone,
        pedidoFocaccias: items,
        quantity: pedido.quantity,
        totalPrice: pedido.totalPrice,
        orderDate: pedido.orderDate.toISOString(),
    };
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

export async function GET() {
    try {
        const pedidos = await prisma.pedido.findMany({
            orderBy: { orderDate: "desc" },
            include: pedidoInclude,
        });

        return NextResponse.json({
            data: pedidos.map(toPedidoPayload),
            message: "Pedidos obtenidos correctamente",
            success: true,
        });
    } catch (error) {
        console.error("Error al obtener pedidos", error);

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const clientPhone = String(body?.clientPhone ?? "").trim();
        const focaccias = Array.isArray(body?.focaccias) ? body.focaccias : [];

        if (!clientPhone || focaccias.length === 0) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Datos de pedido inválidos",
                    success: false,
                },
                { status: 400 }
            );
        }

        const normalizedItems = focaccias
            .map((item: { focacciaId?: unknown; cantidad?: unknown }) => ({
                focacciaId: Number(item.focacciaId),
                cantidad: Number(item.cantidad),
            }))
            .filter((item: { focacciaId: number; cantidad: number }) => Number.isInteger(item.focacciaId) && item.focacciaId > 0 && Number.isInteger(item.cantidad) && item.cantidad > 0);

        if (normalizedItems.length === 0) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Los items del pedido son inválidos",
                    success: false,
                },
                { status: 400 }
            );
        }

        const quantitiesByFocacciaId = new Map<number, number>();
        for (const item of normalizedItems) {
            const current = quantitiesByFocacciaId.get(item.focacciaId) ?? 0;
            quantitiesByFocacciaId.set(item.focacciaId, current + item.cantidad);
        }

        const focacciaIds = [...quantitiesByFocacciaId.keys()];

        const focacciasInDb = await prisma.focaccia.findMany({
            where: { id: { in: focacciaIds } },
            select: { id: true, price: true },
        });

        if (focacciasInDb.length !== focacciaIds.length) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Una o más focaccias no existen",
                    success: false,
                },
                { status: 400 }
            );
        }

        const pricesById = new Map(focacciasInDb.map((item) => [item.id, item.price]));
        const itemsForCreate = focacciaIds.map((focacciaId) => ({
            focacciaId,
            cantidad: quantitiesByFocacciaId.get(focacciaId) ?? 0,
        }));

        const quantity = itemsForCreate.reduce((acc, item) => acc + item.cantidad, 0);
        const totalPrice = itemsForCreate.reduce((acc, item) => {
            const price = pricesById.get(item.focacciaId) ?? 0;
            return acc + price * item.cantidad;
        }, 0);

        const created = await prisma.pedido.create({
            data: {
                clientPhone,
                quantity,
                totalPrice,
                pedidoFocaccias: {
                    create: itemsForCreate,
                },
            },
            include: pedidoInclude,
        });

        return NextResponse.json(
            {
                data: toPedidoPayload(created),
                message: "Pedido creado correctamente",
                success: true,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error al crear pedido", error);

        return NextResponse.json(
            {
                data: null,
                message: "No se pudo crear el pedido",
                success: false,
            },
            { status: 500 }
        );
    }
}
