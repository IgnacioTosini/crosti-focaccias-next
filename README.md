This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Datos de demostración

`npm run seed:demo` agrega 8 focaccias con imágenes y 6 combos/especiales a la base configurada en `DATABASE_URL`. Conserva los datos existentes y evita duplicados al repetir la carga. Ver [instrucciones del catálogo demo](prisma/demo/README.md).

## Editor de contenido

En `/admin/contenido` se editan los textos e imágenes de Inicio y Mayoristas por sección, incluidas las preguntas frecuentes, el formulario mayorista, los logos y las decoraciones. La vista previa usa las páginas reales en escritorio o celular y mantiene el borrador privado hasta guardar. Cancelar recupera el contenido guardado de la página seleccionada.

Las imágenes nuevas se seleccionan como archivos JPG, PNG o WebP de hasta 4 MB. La vista previa usa archivos locales y solo al guardar se suben a la carpeta `Crosti Focaccias/content` de Cloudinary; la carpeta principal se configura con `CLOUDINARY_UPLOAD_FOLDER` y usa `Crosti Focaccias` por defecto. Las URLs se publican junto con los textos en `PageContent`. La carga utiliza las credenciales `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` del servidor. Las imágenes anteriores se conservan en Cloudinary. Si falla la publicación después de una carga, el editor conserva el borrador y reutiliza esa carga al reintentar.

Los textos se guardan en `PageContent`. Para una instalación nueva, ejecutá `npm run prisma:generate` y `npm run prisma:migrate:deploy` con el `DATABASE_URL` correspondiente. Reiniciá el servidor de desarrollo después de regenerar Prisma si estaba abierto. Los despliegues con `build:vercel` ya ejecutan estos pasos. Las páginas conservan los textos originales hasta su primera edición.

Validación del contenido: `node --experimental-strip-types --test src/lib/siteContent.test.mjs`.

## Desarrollo local

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
