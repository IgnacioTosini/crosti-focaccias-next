import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { defaultContent, publishedValues, type ContentDocument, type ContentPage } from '@/lib/siteContent';

export async function readContent(page: ContentPage): Promise<ContentDocument> {
    const record = await prisma.pageContent.findUnique({ where: { page } });
    return { values: publishedValues(page, record?.values), revision: record?.revision ?? 0, updatedAt: record?.updatedAt.toISOString() ?? null };
}

const cachedContent = unstable_cache(readContent, ['site-content'], { revalidate: 300, tags: ['site-content'] });

export async function getPublishedContent(page: ContentPage) {
    try {
        return (await cachedContent(page)).values;
    } catch (error) {
        console.error('No se pudo leer el contenido publicado:', error instanceof Error ? error.name : 'UnknownError');
        return defaultContent(page);
    }
}
