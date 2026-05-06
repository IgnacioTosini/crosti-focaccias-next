'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { FocacciaCreate } from '@/types';
import { prisma } from '@/lib/prisma';

type FocacciaMutationInput = FocacciaCreate;

const ensureAdminSession = async () => {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin-session')?.value === 'true';

    if (!isAdmin) {
        throw new Error('No autorizado');
    }
};

const refreshFocacciaCache = () => {
    revalidateTag('focaccias', 'max');
    revalidatePath('/');
    revalidatePath('/admin');
};

export async function createFocacciaAction(data: FocacciaMutationInput) {
    await ensureAdminSession();

    const focaccia = await prisma.focaccia.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            isVeggie: data.isVeggie,
            imageUrl: data.imageUrl,
            imagePublicId: data.imagePublicId,
            featured: data.featured,
        },
    });

    refreshFocacciaCache();
    return focaccia;
}

export async function updateFocacciaAction(id: number, data: FocacciaMutationInput) {
    await ensureAdminSession();

    const focaccia = await prisma.focaccia.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            isVeggie: data.isVeggie,
            imageUrl: data.imageUrl,
            imagePublicId: data.imagePublicId,
            featured: data.featured,
        },
    });

    refreshFocacciaCache();
    return focaccia;
}

export async function deleteFocacciaAction(id: number) {
    await ensureAdminSession();

    await prisma.focaccia.delete({
        where: { id },
    });

    refreshFocacciaCache();
    return { success: true };
}
