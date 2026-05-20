import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FocacciaSize, Prisma } from "@prisma/client";

type PromotionTypeApi = "focaccias" | "prepizzas" | "combos";
type PromotionItemTypeApi = "focaccia" | "prepizza" | "extra";
type PromotionTypeDb = "FOCACCIAS" | "PREPIZZAS" | "COMBOS";
type PromotionItemTypeDb = "FOCACCIA" | "PREPIZZA" | "EXTRA";

type PromotionItemInput = {
    itemType: PromotionItemTypeDb;
    label?: string;
    quantity: number;
    size?: FocacciaSize;
    order: number;
};

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

const toApiType = (value: PromotionTypeDb): PromotionTypeApi => {
    if (value === "FOCACCIAS") return "focaccias";
    if (value === "PREPIZZAS") return "prepizzas";
    return "combos";
};

const toApiItemType = (value: PromotionItemTypeDb): PromotionItemTypeApi => {
    if (value === "FOCACCIA") return "focaccia";
    if (value === "PREPIZZA") return "prepizza";
    return "extra";
};

const normalizeItems = (value: unknown): PromotionItemInput[] | null => {
    if (value === undefined) {
        return [];
    }

    if (!Array.isArray(value)) {
        return null;
    }

    const normalized: PromotionItemInput[] = [];

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

        normalized.push({
            itemType,
            label,
            quantity,
            size,
            order,
        });
    }

    return normalized;
};

const toPromotionPayload = (promocion: {
    id: number;
    people: number;
    title: string;
    description: string;
    price: number;
    type: PromotionTypeDb;
    updatedAt: Date;
    items: Array<{
        id: number;
        itemType: PromotionItemTypeDb;
        label: string | null;
        quantity: number;
        size: FocacciaSize | null;
        order: number;
    }>;
}) => ({
    id: promocion.id,
    people: promocion.people,
    title: promocion.title,
    description: promocion.description,
    price: promocion.price,
    type: toApiType(promocion.type),
    updatedAt: promocion.updatedAt,
    items: promocion.items.map((item) => ({
        id: item.id,
        itemType: toApiItemType(item.itemType),
        label: item.label,
        quantity: item.quantity,
        size: item.size,
        order: item.order,
    })),
});

export async function GET() {
    try {
        const promociones = await prisma.promocion.findMany({
            orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
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

        const promoIds = promociones.map((promo) => promo.id);
        const itemsByPromotionId = new Map<number, Array<{
            id: number;
            itemType: PromotionItemTypeDb;
            label: string | null;
            quantity: number;
            size: FocacciaSize | null;
            order: number;
        }>>();

        if (promoIds.length > 0) {
            const items = await prisma.$queryRaw<Array<{
                id: number;
                promocionId: number;
                itemType: PromotionItemTypeDb;
                label: string | null;
                quantity: number;
                size: FocacciaSize | null;
                order: number;
            }>>(Prisma.sql`
                SELECT "id", "promocionId", "itemType", "label", "quantity", "size", "order"
                FROM "PromocionItem"
                WHERE "promocionId" IN (${Prisma.join(promoIds)})
                ORDER BY "order" ASC, "id" ASC
            `);

            for (const item of items) {
                const current = itemsByPromotionId.get(item.promocionId) ?? [];
                current.push({
                    id: item.id,
                    itemType: item.itemType,
                    label: item.label,
                    quantity: item.quantity,
                    size: item.size,
                    order: item.order,
                });
                itemsByPromotionId.set(item.promocionId, current);
            }
        }

        return NextResponse.json({
            data: promociones.map((promo) =>
                toPromotionPayload({
                    ...promo,
                    type: promo.type as PromotionTypeDb,
                    items: itemsByPromotionId.get(promo.id) ?? [],
                })
            ),
            success: true,
            message: "Promociones obtenidas correctamente",
        });
    } catch (error) {
        console.error("Error al obtener promociones", error);
        return NextResponse.json({ data: [], success: false, message: "No se pudieron obtener las promociones" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const people = Number(body?.people);
        const title = String(body?.title ?? "").trim();
        const description = String(body?.description ?? "").trim();
        const price = Number(body?.price);
        const type = parseType(body?.type);
        const items = normalizeItems(body?.items);

        if (!Number.isInteger(people) || people < 0 || !title || !description || !Number.isFinite(price) || price < 0 || !type || !items) {
            return NextResponse.json({ data: null, success: false, message: "Datos de promoción inválidos" }, { status: 400 });
        }

        const created = await prisma.$transaction(async (tx) => {
            const newPromotion = await tx.promocion.create({
                data: {
                    people,
                    title,
                    description,
                    price,
                    type,
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

            if (items.length > 0) {
                const values = items.map((item) =>
                    Prisma.sql`(${newPromotion.id}, ${item.itemType}::"PromocionItemType", ${item.label ?? null}, ${item.quantity}, ${item.size ?? null}::"FocacciaSize", ${item.order})`
                );

                await tx.$executeRaw(Prisma.sql`
                    INSERT INTO "PromocionItem" ("promocionId", "itemType", "label", "quantity", "size", "order")
                    VALUES ${Prisma.join(values)}
                `);
            }

            const createdItems = await tx.$queryRaw<Array<{
                id: number;
                itemType: PromotionItemTypeDb;
                label: string | null;
                quantity: number;
                size: FocacciaSize | null;
                order: number;
            }>>(Prisma.sql`
                SELECT "id", "itemType", "label", "quantity", "size", "order"
                FROM "PromocionItem"
                WHERE "promocionId" = ${newPromotion.id}
                ORDER BY "order" ASC, "id" ASC
            `);

            return {
                ...newPromotion,
                type: newPromotion.type as PromotionTypeDb,
                items: createdItems,
            };
        });

        return NextResponse.json({ data: toPromotionPayload(created), success: true, message: "Promoción creada correctamente" }, { status: 201 });
    } catch (error) {
        console.error("Error al crear promoción", error);
        return NextResponse.json({ data: null, success: false, message: "No se pudo crear la promoción" }, { status: 500 });
    }
}
