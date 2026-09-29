import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { contentPages, isContentPage, validateContent } from '@/lib/siteContent';
import { readContent } from '@/services/SiteContentService';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };
type Context = { params: Promise<{ page: string }> };
const response = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });

export async function GET(request: NextRequest, { params }: Context) {
    if (request.cookies.get('admin-session')?.value !== 'true') return response({ message: 'Iniciá sesión para editar el contenido.' }, 401);
    const { page } = await params;
    if (!isContentPage(page)) return response({ message: 'Página no encontrada.' }, 404);
    try {
        return response({ data: await readContent(page) });
    } catch {
        return response({ message: 'No pudimos cargar los textos guardados. Revisá la conexión con la base de datos e intentá nuevamente.' }, 503);
    }
}

export async function PUT(request: NextRequest, { params }: Context) {
    if (request.cookies.get('admin-session')?.value !== 'true') return response({ message: 'Tu sesión venció. Volvé a iniciar sesión antes de guardar.' }, 401);
    if (request.headers.get('origin') && request.headers.get('origin') !== request.nextUrl.origin) return response({ message: 'Origen no permitido.' }, 403);
    const { page } = await params;
    if (!isContentPage(page)) return response({ message: 'Página no encontrada.' }, 404);

    let body;
    try {
        const raw = await request.text();
        if (raw.length > 150_000) return response({ message: 'El contenido es demasiado extenso.' }, 413);
        body = JSON.parse(raw);
    } catch {
        return response({ message: 'El contenido enviado no es válido.' }, 400);
    }
    if (!body || !Number.isSafeInteger(body.revision) || body.revision < 0) return response({ message: 'La versión del contenido no es válida.' }, 400);
    const { values, errors } = validateContent(page, body.values, { cloudName: process.env.CLOUDINARY_CLOUD_NAME });
    if (Object.keys(errors).length) return response({ message: 'Revisá los campos marcados antes de guardar.', errors }, 400);

    try {
        const record = await prisma.$transaction(async (tx) => {
            if (body.revision === 0) return tx.pageContent.create({ data: { page, values } });
            const result = await tx.pageContent.updateMany({ where: { page, revision: body.revision }, data: { values, revision: { increment: 1 } } });
            if (result.count !== 1) return null;
            return tx.pageContent.findUniqueOrThrow({ where: { page } });
        });
        if (!record) return response({ message: 'Otra pestaña guardó una versión más reciente. Conservamos tu borrador: copiá los textos que quieras mantener y recargá para editar la versión actual.' }, 409);
        revalidateTag('site-content', { expire: 0 });
        revalidatePath(contentPages[page].path);
        return response({ data: { values, revision: record.revision, updatedAt: record.updatedAt.toISOString() } });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return response({ message: 'Otra pestaña publicó esta página. Conservamos tu borrador; recargá antes de volver a guardar.' }, 409);
        console.error('No se pudo guardar el contenido:', error instanceof Error ? error.name : 'UnknownError');
        return response({ message: 'No pudimos guardar los cambios. Tu borrador sigue en el editor; intentá nuevamente.' }, 503);
    }
}
