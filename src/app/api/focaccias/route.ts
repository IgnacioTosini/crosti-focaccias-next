import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const maxDuration = 10;

const focacciaSelect = {
    id: true,
    name: true,
    description: true,
    mediumPrice: true,
    largePrice: true,
    isVeggie: true,
    imageUrl: true,
    imagePublicId: true,
    featured: true,
    isAvailable: true,
} as const;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const isFeatured = searchParams.get("featured") === "true";

    try {
        const focaccias = await prisma.focaccia.findMany({
            where: isFeatured ? { featured: true } : undefined,
            orderBy: [{ featured: "desc" }, { id: "asc" }],
            select: focacciaSelect,
        });

        return NextResponse.json(
            {
                data: focaccias.map((item: (typeof focaccias)[number]) => ({
                    ...item,
                    price: item.mediumPrice,
                    pedidos: [],
                })),
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("No pudimos obtener las focaccias en este momento", error);
        return NextResponse.json(
            { error: "No pudimos obtener las focaccias en este momento" },
            { status: 503 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const mediumPrice = Number(body.mediumPrice ?? body.price);
        const largePrice = Number(body.largePrice ?? body.price);

        if (!Number.isFinite(mediumPrice) || mediumPrice <= 0 || !Number.isFinite(largePrice) || largePrice <= 0) {
            return NextResponse.json(
                { error: "Precios inválidos" },
                { status: 400 }
            );
        }

        const created = await prisma.focaccia.create({
            data: {
                name: body.name,
                description: body.description,
                mediumPrice,
                largePrice,
                isVeggie: Boolean(body.isVeggie),
                imageUrl: body.imageUrl,
                imagePublicId: body.imagePublicId,
                featured: Boolean(body.featured),
                isAvailable: body.isAvailable === undefined ? true : Boolean(body.isAvailable),
            },
            select: focacciaSelect,
        });

        revalidateTag("focaccias", "max");

        return NextResponse.json({
            data: {
                ...created,
                price: created.mediumPrice,
                pedidos: [],
            },
        });
    } catch (error: unknown) {
        const prismaError = error as { message?: string };
        console.error("Error creating focaccia", prismaError.message ?? error);

        return NextResponse.json(
            { error: "Error creating focaccia" },
            { status: 500 }
        );
    }
}
