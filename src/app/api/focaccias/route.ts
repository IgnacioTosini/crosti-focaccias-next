import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const maxDuration = 10;

const focacciaSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    isVeggie: true,
    imageUrl: true,
    imagePublicId: true,
    featured: true,
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

        const created = await prisma.focaccia.create({
            data: {
                name: body.name,
                description: body.description,
                price: Number(body.price),
                isVeggie: Boolean(body.isVeggie),
                imageUrl: body.imageUrl,
                imagePublicId: body.imagePublicId,
                featured: Boolean(body.featured),
            },
            select: focacciaSelect,
        });

        revalidateTag("focaccias", "max");

        return NextResponse.json({
            data: {
                ...created,
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
