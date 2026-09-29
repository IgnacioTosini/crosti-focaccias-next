import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomUUID } from 'node:crypto';
import { CONTENT_IMAGE_MAX_BYTES, CONTENT_IMAGE_TYPES, contentImagePublicId } from '@/lib/siteContent';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store' };
const respond = (data: unknown, status = 200) => NextResponse.json(data, { status, headers });

export async function POST(request: NextRequest) {
    if (request.cookies.get('admin-session')?.value !== 'true') return respond({ message: 'Iniciá sesión para subir imágenes.' }, 401);
    if (request.headers.get('origin') && request.headers.get('origin') !== request.nextUrl.origin) return respond({ message: 'Origen no permitido.' }, 403);
    const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
    if (!cloud || !key || !secret) return respond({ message: 'No está configurada la carga de imágenes.' }, 503);
    if (Number(request.headers.get('content-length')) > CONTENT_IMAGE_MAX_BYTES + 65_536) return respond({ message: 'La imagen puede pesar hasta 4 MB.' }, 413);

    let file;
    try { file = (await request.formData()).get('file'); }
    catch { return respond({ message: 'No pudimos leer el archivo.' }, 400); }
    if (!(file instanceof File) || !file.size) return respond({ message: 'Elegí una imagen para subir.' }, 400);
    if (file.size > CONTENT_IMAGE_MAX_BYTES) return respond({ message: 'La imagen puede pesar hasta 4 MB.' }, 413);
    if (!CONTENT_IMAGE_TYPES.includes(file.type)) return respond({ message: 'Usá una imagen JPG, PNG o WebP.' }, 415);
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const signatureMatches = file.type === 'image/jpeg' ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
        : file.type === 'image/png' ? Buffer.from(bytes.slice(0, 8)).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            : Buffer.from(bytes.slice(0, 4)).toString() === 'RIFF' && Buffer.from(bytes.slice(8, 12)).toString() === 'WEBP';
    if (!signatureMatches) return respond({ message: 'El archivo no es una imagen válida.' }, 415);

    try {
        // The folder in the Media Library and the public ID both stay under content.
        const params = { asset_folder: 'content', public_id: `content/${randomUUID()}`, overwrite: 'false', allowed_formats: 'jpg,png,webp', timestamp: String(Math.floor(Date.now() / 1000)) };
        const signature = createHash('sha1').update(Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('&') + secret).digest('hex');
        const form = new FormData();
        form.append('file', file);
        form.append('api_key', key);
        form.append('signature', signature);
        Object.entries(params).forEach(([key, value]) => form.append(key, value));
        const result = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: form, cache: 'no-store', signal: AbortSignal.timeout(45_000) });
        const data = await result.json();
        if (!result.ok || typeof data.secure_url !== 'string' || !contentImagePublicId(data.secure_url, cloud)) return respond({ message: 'No pudimos subir la imagen. Revisá el archivo e intentá nuevamente.' }, 502);
        return respond({ url: data.secure_url, publicId: data.public_id });
    } catch {
        return respond({ message: 'No pudimos conectar con el servicio de imágenes. Intentá nuevamente.' }, 503);
    }
}
