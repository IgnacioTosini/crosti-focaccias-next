import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { FocacciaItem } from "@/types";

const MENU_REVALIDATE_TIME = 60 * 30;

const mapFocaccia = (item: {
    id: number;
    name: string;
    description: string;
    mediumPrice: number;
    largePrice: number;
    isVeggie: boolean;
    imageUrl: string;
    imagePublicId: string;
    featured: boolean;
    isAvailable: boolean;
}): FocacciaItem => ({
    ...item,
    price: item.mediumPrice,
    pedidos: [],
});

const getCachedFocaccias = unstable_cache(
    async (featured: boolean) => {
        const focaccias = await prisma.focaccia.findMany({
            where: featured ? { featured: true } : undefined,
            orderBy: [{ featured: "desc" }, { id: "asc" }],
            select: {
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
            },
        });

        return focaccias.map(mapFocaccia);
    },
    ["focaccias-server"],
    {
        revalidate: MENU_REVALIDATE_TIME,
        tags: ["focaccias"],
    }
);

export async function fetchServerFocaccias(
    options: { featured?: boolean } = {}
): Promise<FocacciaItem[]> {
    const { featured = false } = options;

    try {
        return await getCachedFocaccias(featured);
    } catch (error) {
        console.error("Error al precargar el menú en el servidor:", error);
        return [];
    }
}

export async function getServerFocaccias(): Promise<FocacciaItem[]> {
    return fetchServerFocaccias();
}
