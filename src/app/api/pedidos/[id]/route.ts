import { PedidoStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pedidoInclude, toPedidoPayload } from "@/lib/pedidoPayload";

const parseId = (value: string) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const validStatuses = new Set<PedidoStatus>([
    PedidoStatus.PENDIENTE,
    PedidoStatus.CONFIRMADO,
    PedidoStatus.EN_PREPARACION,
    PedidoStatus.LISTO,
    PedidoStatus.ENTREGADO,
    PedidoStatus.CANCELADO,
]);

const allowedTransitions: Record<PedidoStatus, PedidoStatus[]> = {
    [PedidoStatus.PENDIENTE]: [PedidoStatus.CONFIRMADO, PedidoStatus.CANCELADO],
    [PedidoStatus.CONFIRMADO]: [PedidoStatus.EN_PREPARACION, PedidoStatus.CANCELADO],
    [PedidoStatus.EN_PREPARACION]: [PedidoStatus.LISTO, PedidoStatus.CANCELADO],
    [PedidoStatus.LISTO]: [PedidoStatus.ENTREGADO, PedidoStatus.CANCELADO],
    [PedidoStatus.ENTREGADO]: [],
    [PedidoStatus.CANCELADO]: [],
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

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

        const body = await request.json();
        const nextStatusValue = String(body?.status ?? "").trim().toUpperCase() as PedidoStatus;

        if (!validStatuses.has(nextStatusValue)) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Estado de pedido inválido",
                    success: false,
                },
                { status: 400 }
            );
        }

        const currentPedido = await prisma.pedido.findUnique({
            where: { id: pedidoId },
            select: { status: true },
        });

        if (!currentPedido) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Pedido no encontrado",
                    success: false,
                },
                { status: 404 }
            );
        }

        if (currentPedido.status !== nextStatusValue) {
            const allowedNextStatuses = allowedTransitions[currentPedido.status] ?? [];
            if (!allowedNextStatuses.includes(nextStatusValue)) {
                return NextResponse.json(
                    {
                        data: null,
                        message: `No se puede pasar de ${currentPedido.status} a ${nextStatusValue}`,
                        success: false,
                    },
                    { status: 400 }
                );
            }
        }

        const updatedPedido = await prisma.pedido.update({
            where: { id: pedidoId },
            data: {
                status: nextStatusValue,
                deliveredAt: nextStatusValue === PedidoStatus.ENTREGADO ? new Date() : null,
            },
            include: pedidoInclude,
        });

        return NextResponse.json({
            data: toPedidoPayload(updatedPedido),
            message: "Estado del pedido actualizado correctamente",
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

        console.error("Error al actualizar estado de pedido", error);

        return NextResponse.json(
            {
                data: null,
                message: "No se pudo actualizar el estado del pedido",
                success: false,
            },
            { status: 500 }
        );
    }
}
