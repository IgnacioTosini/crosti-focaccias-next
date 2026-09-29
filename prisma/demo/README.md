# Catálogo de demostración

Ocho focaccias con fotos ilustrativas generadas por IA y seis promociones: tres combos, una degustación y dos packs de prepizzas. Los precios son ficticios, en ARS. Las fotos se generaron con la herramienta integrada `image_gen`; los prompts completos están en `image-prompts.json` y los archivos WebP en `images/`.

Desde la raíz del proyecto:

```sh
npm run seed:demo
```

Usa `DATABASE_URL` y las credenciales `CLOUDINARY_*` del entorno de Next.js (`.env`, con la precedencia habitual de variables del proceso y archivos locales). Carga las fotos en la carpeta `demo-catalog-v1` dentro de `CLOUDINARY_UPLOAD_FOLDER`, con un identificador distinto por producto. No cambia el esquema ni requiere nuevas migraciones.

Agrega únicamente los registros faltantes; no elimina ni modifica registros existentes. Identifica los productos por `imagePublicId` y las promociones por título y tipo. Se puede repetir la carga sin duplicarlos. Las inserciones en la base se realizan en una transacción; las imágenes subidas permanecen en Cloudinary si la transacción falla y se reutilizan al reintentar.

Para comprobar los registros, los ítems de las promociones y las URLs de las fotos sin escribir:

```sh
npm run seed:demo -- --verify
```

Los combos usan el modelo actual de `Promocion` y `PromocionItem`, que no contiene una imagen propia. Las fotos pertenecen a las focaccias. No se crean pedidos de muestra.
