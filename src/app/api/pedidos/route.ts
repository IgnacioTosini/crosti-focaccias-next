import { FocacciaSize } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pedidoInclude, toPedidoPayload } from "@/lib/pedidoPayload";
import { calculatePromotions } from "@/lib/promociones";

const COMBOS_NOTES_PREFIX = "COMBOS_JSON:";

type ComboPayload = {
    comboId: number;
    title: string;
    cantidad: number;
    unitPrice: number;
    subtotal: number;
    focaccias?: Array<{ label?: string; size?: FocacciaSize; cantidad: number; sabores?: string[] }>;
    prepizzas?: Array<{ label?: string; cantidad: number }>;
    extras?: Array<{ label?: string; cantidad: number }>;
};

const parseSize = (value: unknown): FocacciaSize => {
    if (value === FocacciaSize.GRANDE) {
        return FocacciaSize.GRANDE;
    }

    return FocacciaSize.MEDIANA;
};

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
        const promoCode = String(body?.promoCode ?? "").trim() || undefined;
        const focaccias = Array.isArray(body?.focaccias) ? body.focaccias : [];
        const combos = Array.isArray(body?.combos) ? body.combos : [];

        if (!clientPhone || (focaccias.length === 0 && combos.length === 0)) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Datos de pedido inválidos",
                    success: false,
                },
                { status: 400 }
            );
        }

        const normalizedCombos: ComboPayload[] = combos
            .map((combo: {
                comboId?: unknown;
                title?: unknown;
                cantidad?: unknown;
                unitPrice?: unknown;
                subtotal?: unknown;
                focaccias?: unknown;
                prepizzas?: unknown;
                extras?: unknown;
            }) => {
                const cantidad = Number(combo.cantidad);
                const unitPrice = Number(combo.unitPrice);
                const rawSubtotal = Number(combo.subtotal);
                const subtotal = Number.isFinite(rawSubtotal) && rawSubtotal >= 0
                    ? rawSubtotal
                    : Math.max(0, unitPrice * cantidad);

                const normalizeDetails = (value: unknown) => {
                    if (!Array.isArray(value)) {
                        return [] as Array<{ label?: string; cantidad: number }>;
                    }

                    return value
                        .map((entry: { label?: unknown; cantidad?: unknown; quantity?: unknown }) => {
                            const detailQty = Number(entry.cantidad ?? entry.quantity);
                            if (!Number.isInteger(detailQty) || detailQty <= 0) {
                                return null;
                            }

                            const label = typeof entry.label === "string" ? entry.label.trim() : "";

                            const normalizedDetail: { label?: string; cantidad: number } = {
                                cantidad: detailQty,
                            };

                            if (label) {
                                normalizedDetail.label = label;
                            }

                            return normalizedDetail;
                        })
                        .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
                };

                const normalizeFocaccias = (value: unknown) => {
                    if (!Array.isArray(value)) {
                        return [] as Array<{ label?: string; size?: FocacciaSize; cantidad: number; sabores?: string[] }>;
                    }

                    return value
                        .map((entry: { label?: unknown; size?: unknown; cantidad?: unknown; quantity?: unknown; sabores?: unknown }) => {
                            const detailQty = Number(entry.cantidad ?? entry.quantity);
                            if (!Number.isInteger(detailQty) || detailQty <= 0) {
                                return null;
                            }

                            const label = typeof entry.label === "string" ? entry.label.trim() : "";
                            const size = entry.size === FocacciaSize.GRANDE ? FocacciaSize.GRANDE : entry.size === FocacciaSize.MEDIANA ? FocacciaSize.MEDIANA : undefined;

                            const normalizedDetail: { label?: string; size?: FocacciaSize; cantidad: number; sabores?: string[] } = {
                                cantidad: detailQty,
                            };

                            if (Array.isArray(entry.sabores)) {
                                const sabores = entry.sabores
                                    .filter((sabor): sabor is string => typeof sabor === "string")
                                    .map((sabor) => sabor.trim())
                                    .filter((sabor) => sabor.length > 0);

                                if (sabores.length > 0) {
                                    normalizedDetail.sabores = sabores;
                                }
                            }

                            if (label) {
                                normalizedDetail.label = label;
                            }

                            if (size) {
                                normalizedDetail.size = size;
                            }

                            return normalizedDetail;
                        })
                        .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
                };

                return {
                    comboId: Number(combo.comboId),
                    title: String(combo.title ?? "").trim(),
                    cantidad,
                    unitPrice,
                    subtotal,
                    focaccias: normalizeFocaccias(combo.focaccias),
                    prepizzas: normalizeDetails(combo.prepizzas),
                    extras: normalizeDetails(combo.extras),
                } satisfies ComboPayload;
            })
            .filter((combo: ComboPayload) =>
                Number.isInteger(combo.comboId) &&
                combo.comboId > 0 &&
                combo.title.length > 0 &&
                Number.isInteger(combo.cantidad) &&
                combo.cantidad > 0 &&
                Number.isFinite(combo.unitPrice) &&
                combo.unitPrice >= 0 &&
                Number.isFinite(combo.subtotal) &&
                combo.subtotal >= 0
            );

        const normalizedItems = focaccias
            .map((item: { focacciaId?: unknown; cantidad?: unknown; size?: unknown }) => ({
                focacciaId: Number(item.focacciaId),
                cantidad: Number(item.cantidad),
                size: parseSize(item.size),
            }))
            .filter((item: { focacciaId: number; cantidad: number }) => Number.isInteger(item.focacciaId) && item.focacciaId > 0 && Number.isInteger(item.cantidad) && item.cantidad > 0);

        if (normalizedItems.length === 0 && normalizedCombos.length === 0) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Los items del pedido son inválidos",
                    success: false,
                },
                { status: 400 }
            );
        }

        const quantitiesByFocacciaAndSize = new Map<string, { focacciaId: number; size: FocacciaSize; cantidad: number }>();
        for (const item of normalizedItems) {
            const key = `${item.focacciaId}_${item.size}`;
            const current = quantitiesByFocacciaAndSize.get(key);

            if (current) {
                current.cantidad += item.cantidad;
                continue;
            }

            quantitiesByFocacciaAndSize.set(key, {
                focacciaId: item.focacciaId,
                size: item.size,
                cantidad: item.cantidad,
            });
        }

        const itemsForCalculation = [...quantitiesByFocacciaAndSize.values()];
        const focacciaIds = [...new Set(itemsForCalculation.map((item) => item.focacciaId))];

        const focacciasInDb = await prisma.focaccia.findMany({
            where: { id: { in: focacciaIds } },
            select: { id: true, mediumPrice: true, largePrice: true, isAvailable: true },
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

        if (focacciasInDb.some((item) => !item.isAvailable)) {
            return NextResponse.json(
                {
                    data: null,
                    message: "Una o más focaccias no están disponibles",
                    success: false,
                },
                { status: 400 }
            );
        }

        const pricesById = new Map(focacciasInDb.map((item) => [item.id, item]));

        const itemsForCreate = itemsForCalculation.map((item) => {
            const focaccia = pricesById.get(item.focacciaId);
            const unitPrice = item.size === FocacciaSize.GRANDE ? focaccia?.largePrice ?? 0 : focaccia?.mediumPrice ?? 0;
            const lineSubtotal = unitPrice * item.cantidad;
            const lineDiscount = 0;
            const lineTotal = lineSubtotal - lineDiscount;

            return {
                focacciaId: item.focacciaId,
                size: item.size,
                cantidad: item.cantidad,
                unitPrice,
                lineSubtotal,
                lineDiscount,
                lineTotal,
            };
        });

        const focacciasQuantity = itemsForCreate.reduce((acc, item) => acc + item.cantidad, 0);
        const combosQuantity = normalizedCombos.reduce((acc, combo) => acc + combo.cantidad, 0);
        const quantity = focacciasQuantity + combosQuantity;

        const focacciasSubtotal = itemsForCreate.reduce((acc, item) => acc + item.lineSubtotal, 0);
        const combosSubtotal = normalizedCombos.reduce((acc, combo) => acc + combo.subtotal, 0);
        const subtotal = focacciasSubtotal + combosSubtotal;

        const notes = normalizedCombos.length > 0
            ? `${COMBOS_NOTES_PREFIX}${JSON.stringify(normalizedCombos)}`
            : undefined;

        const created = await prisma.$transaction(async (tx) => {
            const { discountTotal } = await calculatePromotions(tx, {
                promoCode,
                subtotal,
            });

            const totalPrice = Math.max(0, subtotal - discountTotal);

            const createdPedido = await tx.pedido.create({
                data: {
                    clientPhone,
                    quantity,
                    subtotal,
                    discountTotal,
                    totalPrice,
                    notes,
                    pedidoFocaccias: {
                        create: itemsForCreate,
                    },
                },
                include: pedidoInclude,
            });

            return createdPedido;
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
