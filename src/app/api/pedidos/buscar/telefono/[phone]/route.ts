import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pedidoInclude, toPedidoPayload } from "@/lib/pedidoPayload";

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
