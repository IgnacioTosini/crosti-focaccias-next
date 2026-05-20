import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const focacciaId = Number(id);

        if (Number.isNaN(focacciaId)) {
            return NextResponse.json({ error: "Invalid focaccia id" }, { status: 400 });
        }

        const focaccia = await prisma.focaccia.findUnique({
            where: { id: focacciaId },
            select: focacciaSelect,
        });

        if (!focaccia) {
            return NextResponse.json(
                { error: "Error fetching focaccia" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: {
                ...focaccia,
                price: focaccia.mediumPrice,
                pedidos: [],
            },
        });
    } catch (error) {
        console.error("Error fetching focaccia:", error);
        return NextResponse.json(
            { error: "Error fetching focaccia" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        const focacciaId = Number(id);
        const mediumPrice = Number(body.mediumPrice ?? body.price);
        const largePrice = Number(body.largePrice ?? body.price);

        if (Number.isNaN(focacciaId)) {
            return NextResponse.json({ error: "Invalid focaccia id" }, { status: 400 });
        }

        if (!Number.isFinite(mediumPrice) || mediumPrice <= 0 || !Number.isFinite(largePrice) || largePrice <= 0) {
            return NextResponse.json(
                { error: "Precios inválidos" },
                { status: 400 }
            );
        }

        const updated = await prisma.focaccia.update({
            where: { id: focacciaId },
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
                ...updated,
                price: updated.mediumPrice,
                pedidos: [],
            },
        });
    } catch (error: unknown) {
        const prismaError = error as { message?: string };
        console.error(prismaError.message || "Error updating focaccia");
        return NextResponse.json(
            { error: "Error updating focaccia" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const focacciaId = Number(id);
        console.log("Deleting focaccia with id:", focacciaId);

        if (Number.isNaN(focacciaId)) {
            return NextResponse.json({ error: "Invalid focaccia id" }, { status: 400 });
        }

        await prisma.focaccia.delete({
            where: { id: focacciaId },
        });

        revalidateTag("focaccias", "max");

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const prismaError = error as { message?: string };
        console.error(prismaError.message || "Error deleting focaccia");

        return NextResponse.json(
            { error: "Error deleting focaccia" },
            { status: 500 }
        );
    }
}
