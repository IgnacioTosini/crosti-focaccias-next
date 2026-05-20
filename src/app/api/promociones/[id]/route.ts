import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FocacciaSize, Prisma } from "@prisma/client";

const parseId = (value: string) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

type PromotionTypeDb = "FOCACCIAS" | "PREPIZZAS" | "COMBOS";
type PromotionItemTypeDb = "FOCACCIA" | "PREPIZZA" | "EXTRA";

const parseType = (value: unknown): PromotionTypeDb | null => {
    if (value === "focaccias") return "FOCACCIAS";
    if (value === "prepizzas") return "PREPIZZAS";
    if (value === "combos") return "COMBOS";
    return null;
};

const parseItemType = (value: unknown): PromotionItemTypeDb | null => {
    if (value === "focaccia") return "FOCACCIA";
    if (value === "prepizza") return "PREPIZZA";
    if (value === "extra") return "EXTRA";
    return null;
};

const parseSize = (value: unknown): FocacciaSize | undefined => {
    if (value === FocacciaSize.GRANDE) return FocacciaSize.GRANDE;
    if (value === FocacciaSize.MEDIANA) return FocacciaSize.MEDIANA;
    return undefined;
};

const normalizeItems = (value: unknown): Array<{
    itemType: PromotionItemTypeDb;
    label?: string;
    quantity: number;
    size?: FocacciaSize;
    order: number;
}> | null | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (!Array.isArray(value)) {
        return null;
    }

    const normalized = [];

    for (const [index, rawItem] of value.entries()) {
        const item = rawItem as {
            itemType?: unknown;
            label?: unknown;
            quantity?: unknown;
            size?: unknown;
            order?: unknown;
        };

        const itemType = parseItemType(item.itemType);
        const quantity = Number(item.quantity);
        const order = Number.isInteger(Number(item.order)) ? Number(item.order) : index;
        const label = item.label === undefined ? undefined : String(item.label).trim();
        const size = parseSize(item.size);

        if (!itemType || !Number.isInteger(quantity) || quantity <= 0) {
            return null;
        }

        normalized.push({ itemType, label, quantity, size, order });
    }

    return normalized;
};

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const promoId = parseId(id);
        const body = await request.json();

        if (!promoId) {
            return NextResponse.json({ data: null, success: false, message: "ID inválido" }, { status: 400 });
        }

        const type = body?.type === undefined ? undefined : parseType(body.type);
        if (body?.type !== undefined && !type) {
            return NextResponse.json({ data: null, success: false, message: "Tipo inválido" }, { status: 400 });
        }

        const items = normalizeItems(body?.items);
        if (body?.items !== undefined && !items) {
            return NextResponse.json({ data: null, success: false, message: "Items inválidos" }, { status: 400 });
        }

        const typeForUpdate = body?.type === undefined ? undefined : (type as PromotionTypeDb);
        const itemsForUpdate = body?.items === undefined ? undefined : (items as Array<{
            itemType: PromotionItemTypeDb;
            label?: string;
            quantity: number;
            size?: FocacciaSize;
            order: number;
        }>);

        const updated = await prisma.$transaction(async (tx) => {
            const updatedPromotion = await tx.promocion.update({
                where: { id: promoId },
                data: {
                    people: body?.people === undefined ? undefined : Number(body.people),
                    title: body?.title === undefined ? undefined : String(body.title).trim(),
                    description: body?.description === undefined ? undefined : String(body.description).trim(),
                    price: body?.price === undefined ? undefined : Number(body.price),
                    type: typeForUpdate,
                },
                select: {
                    id: true,
                    people: true,
                    title: true,
                    description: true,
                    price: true,
                    type: true,
                    updatedAt: true,
                },
            });

            if (itemsForUpdate !== undefined) {
                await tx.$executeRaw`DELETE FROM "PromocionItem" WHERE "promocionId" = ${promoId}`;

                if (itemsForUpdate.length > 0) {
                    const values = itemsForUpdate.map((item) =>
                        Prisma.sql`(${promoId}, ${item.itemType}::"PromocionItemType", ${item.label ?? null}, ${item.quantity}, ${item.size ?? null}::"FocacciaSize", ${item.order})`
                    );

                    await tx.$executeRaw(Prisma.sql`
                        INSERT INTO "PromocionItem" ("promocionId", "itemType", "label", "quantity", "size", "order")
                        VALUES ${Prisma.join(values)}
                    `);
                }
            }

            const currentItems = await tx.$queryRaw<Array<{
                id: number;
                itemType: PromotionItemTypeDb;
                label: string | null;
                quantity: number;
                size: FocacciaSize | null;
                order: number;
            }>>(Prisma.sql`
                SELECT "id", "itemType", "label", "quantity", "size", "order"
                FROM "PromocionItem"
                WHERE "promocionId" = ${promoId}
                ORDER BY "order" ASC, "id" ASC
            `);

            return {
                ...updatedPromotion,
                type: updatedPromotion.type as PromotionTypeDb,
                items: currentItems,
            };
        });

        return NextResponse.json({
            data: {
                ...updated,
                type:
                    updated.type === "FOCACCIAS"
                        ? "focaccias"
                        : updated.type === "PREPIZZAS"
                            ? "prepizzas"
                            : "combos",
                items: updated.items.map((item) => ({
                    id: item.id,
                    itemType:
                        item.itemType === "FOCACCIA"
                            ? "focaccia"
                            : item.itemType === "PREPIZZA"
                                ? "prepizza"
                                : "extra",
                    label: item.label,
                    quantity: item.quantity,
                    size: item.size,
                    order: item.order,
                })),
            },
            success: true,
            message: "Promoción actualizada",
        });
    } catch (error) {
        console.error("Error al actualizar promoción", error);
        return NextResponse.json({ data: null, success: false, message: "No se pudo actualizar la promoción" }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const promoId = parseId(id);

        if (!promoId) {
            return NextResponse.json({ data: null, success: false, message: "ID inválido" }, { status: 400 });
        }

        await prisma.promocion.delete({ where: { id: promoId } });
        return NextResponse.json({ data: null, success: true, message: "Promoción eliminada" });
    } catch (error) {
        console.error("Error al eliminar promoción", error);
        return NextResponse.json({ data: null, success: false, message: "No se pudo eliminar la promoción" }, { status: 500 });
    }
}
