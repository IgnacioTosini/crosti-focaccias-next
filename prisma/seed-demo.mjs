import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import nextEnv from '@next/env';
import { PrismaClient } from '@prisma/client';
import { products, promotions } from './demo/catalog.mjs';

nextEnv.loadEnvConfig(fileURLToPath(new URL('../', import.meta.url)));

const prisma = new PrismaClient({ log: [] });
const folder = `${process.env.CLOUDINARY_UPLOAD_FOLDER ?? 'Crosti Focaccias'}/demo-catalog-v1`;
const publicIdFor = (product) => `${folder}/${product.slug}`;
const verifyOnly = process.argv.includes('--verify');

async function uploadImage(product) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  assert(cloudName && apiKey && apiSecret, 'Faltan las credenciales de Cloudinary en el entorno.');

  const params = {
    folder,
    overwrite: 'false',
    public_id: product.slug,
    tags: 'crosti-demo',
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const signaturePayload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const form = new FormData();
  for (const [key, value] of Object.entries(params)) form.append(key, value);
  form.append('api_key', apiKey);
  form.append('signature', createHash('sha1').update(signaturePayload + apiSecret).digest('hex'));
  const bytes = await readFile(new URL(`./demo/images/${product.slug}.webp`, import.meta.url));
  form.append('file', new Blob([bytes], { type: 'image/webp' }), `${product.slug}.webp`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(60_000),
  });
  assert(response.ok, `No se pudo subir ${product.slug} a Cloudinary (HTTP ${response.status}).`);
  const image = await response.json();
  assert.equal(image.public_id, publicIdFor(product), 'Cloudinary devolvió un identificador inesperado.');
  assert(image.secure_url?.startsWith('https://res.cloudinary.com/'), 'Cloudinary no devolvió una URL válida.');
  return { imageUrl: image.secure_url, imagePublicId: image.public_id };
}

async function seed() {
  const existing = await prisma.focaccia.findMany({
    where: { imagePublicId: { in: products.map(publicIdFor) } },
    select: { imagePublicId: true },
  });
  const existingIds = new Set(existing.map((product) => product.imagePublicId));
  const images = new Map();
  for (const product of products) {
    if (!existingIds.has(publicIdFor(product))) {
      images.set(product.slug, await uploadImage(product));
      console.log(`Imagen lista: ${product.name}`);
    }
  }

  // Las altas y sus ítems se confirman juntas. No se modifica ni borra contenido previo.
  const created = await prisma.$transaction(async (tx) => {
    // Evita duplicados incluso si se ejecutan dos cargas demo simultáneamente.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(783612940)::text AS locked`;
    const counts = { products: 0, promotions: 0 };
    for (const { slug, ...product } of products) {
      const imagePublicId = publicIdFor({ slug });
      const found = await tx.focaccia.findFirst({ where: { imagePublicId }, select: { id: true } });
      if (found) continue;
      const image = images.get(slug);
      assert(image, `Falta la imagen de ${slug}; volvé a ejecutar la carga.`);
      await tx.focaccia.create({ data: { ...product, ...image, isAvailable: true } });
      counts.products++;
    }
    for (const { items, ...promotion } of promotions) {
      const found = await tx.promocion.findFirst({
        where: { title: promotion.title, type: promotion.type },
        select: { id: true },
      });
      if (found) continue;
      await tx.promocion.create({
        data: {
          ...promotion,
          items: { create: items.map((item, order) => ({ ...item, order })) },
        },
      });
      counts.promotions++;
    }
    return counts;
  }, { maxWait: 15_000, timeout: 60_000 });
  console.log(`Creados: ${created.products} productos y ${created.promotions} combos/especiales.`);
}

async function verify() {
  const [savedProducts, savedPromotions, totalProducts, totalPromotions] = await Promise.all([
    prisma.focaccia.findMany({ where: { imagePublicId: { in: products.map(publicIdFor) } } }),
    prisma.promocion.findMany({
      where: { OR: promotions.map(({ title, type }) => ({ title, type })) },
      include: { items: { orderBy: { order: 'asc' } } },
    }),
    prisma.focaccia.count(),
    prisma.promocion.count(),
  ]);
  assert.equal(savedProducts.length, products.length, 'Cantidad inesperada de productos demo.');
  assert.equal(savedPromotions.length, promotions.length, 'Cantidad inesperada de promociones demo.');
  for (const product of savedProducts) {
    assert(product.mediumPrice > 0 && product.largePrice >= product.mediumPrice, `Precios inválidos: ${product.name}`);
    const response = await fetch(product.imageUrl, { method: 'HEAD', signal: AbortSignal.timeout(30_000) });
    assert(response.ok && response.headers.get('content-type')?.startsWith('image/'), `Imagen inaccesible: ${product.name}`);
  }
  for (const promotion of savedPromotions) {
    const expected = promotions.find((item) => item.title === promotion.title && item.type === promotion.type);
    assert.equal(promotion.items.length, expected.items.length, `Faltan ítems en ${promotion.title}`);
    for (const [index, expectedItem] of expected.items.entries()) {
      const { itemType, label, quantity, size, order } = promotion.items[index];
      assert.deepEqual({ itemType, label, quantity, size, order }, { size: null, ...expectedItem, order: index });
    }
  }
  console.log(`Verificados: ${savedProducts.length} productos con imágenes y ${savedPromotions.length} promociones con sus ítems.`);
  console.log(`Totales en la base: ${totalProducts} productos y ${totalPromotions} promociones.`);
}

try {
  assert(process.env.DATABASE_URL, 'Falta DATABASE_URL en el entorno.');
  const target = new URL(process.env.DATABASE_URL);
  console.log(`Destino: ${target.hostname.endsWith('.neon.tech') ? 'Neon' : 'PostgreSQL'} configurado en DATABASE_URL.`);
  if (!verifyOnly) await seed();
  await verify();
} catch (error) {
  // No imprimir errores crudos de conexión que puedan incluir credenciales.
  console.error(error.code?.startsWith('P') || error.name?.startsWith('Prisma')
    ? `Falló la operación de base de datos (${error.code ?? error.name}). Revisá conexión y migraciones.`
    : error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
