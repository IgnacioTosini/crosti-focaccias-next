import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

        if (Number.isNaN(focacciaId)) {
            return NextResponse.json({ error: "Invalid focaccia id" }, { status: 400 });
        }

        const updated = await prisma.focaccia.update({
            where: { id: focacciaId },
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
                ...updated,
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
