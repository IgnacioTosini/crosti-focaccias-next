export type ContentPage = 'home' | 'wholesalers';
export type ContentValues = Record<string, string>;
export type ContentDocument = { values: ContentValues; revision: number; updatedAt: string | null };
export type ContentField = { key: string; label: string; defaultValue: string; multiline: boolean; maxLength: number; image?: { hint: string } };
export type ContentSection = { id: string; title: string; fields: ContentField[] };

type FieldInput = [key: string, label: string, value: string, multiline?: boolean];
const section = (id: string, title: string, fields: FieldInput[]): ContentSection => ({
    id, title,
    fields: fields.map(([key, label, defaultValue, multiline = false]) => ({
        key: `${id}.${key}`, label, defaultValue, multiline, maxLength: multiline ? 2000 : 250,
    })),
});

const footer = section('footer', 'Pie de página', [
    ['brand', 'Marca', 'Crosti Focaccias'],
    ['tagline', 'Descripción', 'Artesanales en Mar del Plata'],
    ['credit', 'Frase de cierre', 'Hecho con amor en Mar del Plata'],
    ['copyright', 'Derechos reservados (el año se agrega automáticamente)', 'Crosti Focaccias. Todos los derechos reservados.'],
]);

const textPages: Record<ContentPage, { label: string; path: string; sections: ContentSection[] }> = {
    home: {
        label: 'Inicio', path: '/', sections: [
            section('banner', 'Portada', [
                ['eyebrow', 'Texto superior', 'Focaccias artesanales en Mar del Plata'],
                ['title', 'Título', 'La ola de sabor en'],
                ['highlight', 'Parte destacada del título', 'La Feliz'],
                ['description', 'Descripción', 'Masa madre, ingredientes frescos y focaccias hechas en el día para compartir sin vueltas.', true],
                ['menuButton', 'Botón del menú', 'Ver menú'],
                ['whatsappButton', 'Botón de WhatsApp', 'WhatsApp'],
            ]),
            section('about', 'Sobre Crosti', [
                ['title', 'Título', 'Sobre Crosti'],
                ['eyebrow', 'Texto superior', 'Hecho en Mar del Plata'],
                ['paragraph1', 'Primer párrafo', 'Crosti nació del amor por la cocina artesanal y la pasión por crear momentos especiales alrededor de la mesa. Cada focaccia es preparada con masa madre, ingredientes frescos y el cariño de siempre.', true],
                ['paragraph2', 'Segundo párrafo', 'Desde Mar del Plata, llevamos el sabor auténtico de Italia a tu hogar, con opciones que cuidan tanto el paladar como las preferencias de cada familia.', true],
                ['veggie', 'Destacado vegetariano', 'Opciones veggie disponibles'],
                ['dough', 'Destacado de elaboración', 'Masa madre · Hechas en el día'],
                ['caption', 'Texto de la imagen', 'Hecho con amor y tradición'],
            ]),
            section('menu', 'Presentación del menú', [
                ['title', 'Título', 'Nuestro Menú'],
                ['infoTitle', 'Título de información adicional', 'Extra info:'],
                ['info', 'Información adicional', 'Tenés tamaños mediana y grande. Si te sobra, podés congelarla hasta por 60 días ❄️', true],
            ]),
            section('order', 'Cómo pedir', [
                ['title', 'Título', '¿Cómo Pedir?'],
                ['step1Title', 'Paso 1: título', 'Elegí'],
                ['step1Line1', 'Paso 1: primera línea', 'Revisá sabores, tamaños y combos.'],
                ['step1Line2', 'Paso 1: segunda línea', 'Agregá al carrito lo que querés compartir.'],
                ['step2Title', 'Paso 2: título', 'Confirmá'],
                ['step2Line1', 'Paso 2: primera línea', 'Enviá el pedido por WhatsApp.'],
                ['step2Line2', 'Paso 2: segunda línea', 'Lo tomamos con anticipación para el finde.'],
                ['step3Title', 'Paso 3: título', 'Coordiná'],
                ['step3Line1', 'Paso 3: primera línea', 'Entrega en zonas de Mar del Plata.'],
                ['step3Line2', 'Paso 3: segunda línea', 'También podés retirar y elegir medio de pago.'],
                ['note', 'Nota al pie', 'Los pedidos se coordinan con anticipación para que salga todo fresco.', true],
            ]),
            section('faq', 'Preguntas frecuentes', [
                ['eyebrow', 'Texto superior', 'Todo lo que necesitás saber'],
                ['title', 'Título', 'Preguntas frecuentes'],
                ['description', 'Descripción', 'Resolvemos las dudas más comunes para que elegir y pedir sea fácil.', true],
                ['question1', 'Pregunta 1', '¿Qué tamaño me conviene elegir?'],
                ['answer1', 'Respuesta 1', 'La focaccia mediana rinde aproximadamente para 2 o 3 personas y la grande para 4 a 6. Depende de si va a ser el plato principal o parte de una picada.', true],
                ['question2', 'Pregunta 2', '¿Cómo hago mi pedido?'],
                ['answer2', 'Respuesta 2', 'Elegí las focaccias o combos del menú, agregalos al carrito y completá los sabores. Desde ahí podés enviarnos el pedido por WhatsApp para confirmarlo.', true],
                ['question3', 'Pregunta 3', '¿Con cuánto tiempo de anticipación tengo que pedir?'],
                ['answer3', 'Respuesta 3', 'Trabajamos con masa madre y preparamos todo fresco, por eso recomendamos reservar con anticipación, especialmente para el fin de semana. La disponibilidad final se confirma por WhatsApp.', true],
                ['question4', 'Pregunta 4', '¿Hacen envíos o se puede retirar?'],
                ['answer4', 'Respuesta 4', 'Coordinamos entregas en distintas zonas de Mar del Plata y también podés retirar. El costo y el horario se confirman por WhatsApp según tu ubicación.', true],
                ['question5', 'Pregunta 5', '¿Tienen opciones vegetarianas?'],
                ['answer5', 'Respuesta 5', 'Sí. Las opciones vegetarianas están identificadas con una etiqueta verde en el menú. Si tenés alergias, intolerancias o necesitás una preparación especial, consultanos antes de pedir.', true],
                ['question6', 'Pregunta 6', '¿Cómo se conservan?'],
                ['answer6', 'Respuesta 6', 'Podés disfrutarlas en el momento, calentarlas unos minutos antes de servir o congelarlas hasta por 60 días para tener siempre una lista.', true],
                ['contactTitle', 'Título de contacto', '¿Te quedó alguna duda?'],
                ['contactDescription', 'Texto de contacto', 'Escribinos y te ayudamos con disponibilidad, entrega o una consulta especial.', true],
                ['contactButton', 'Botón de contacto', 'Consultar por WhatsApp'],
            ]),
            section('contact', 'Contacto', [
                ['title', 'Título', '¡Conectemos!'],
                ['whatsappTitle', 'Título de WhatsApp', 'WhatsApp'],
                ['whatsappDescription', 'Texto de WhatsApp', 'Enviar mensaje'],
                ['instagramTitle', 'Título de Instagram', 'Instagram'],
                ['instagramDescription', 'Texto de Instagram', '@crosti.focaccias'],
                ['locationTitle', 'Título de ubicación', 'Ubicación'],
                ['locationDescription', 'Ubicación', 'Mar del Plata'],
            ]),
            section('nav', 'Navegación', [
                ['about', 'Sobre nosotros', 'Sobre nosotros'], ['menu', 'Menú', 'Menú'],
                ['faq', 'Preguntas', 'Preguntas'], ['contact', 'Contacto', 'Contacto'],
                ['wholesalers', 'Mayoristas', 'Mayoristas'], ['cart', 'Carrito', 'Carrito'],
            ]),
            footer,
        ],
    },
    wholesalers: {
        label: 'Mayoristas', path: '/wholesalers', sections: [
            section('hero', 'Portada', [
                ['badge', 'Texto superior', '🏢 Ventas Mayoristas'],
                ['title', 'Título', 'Focaccias artesanales'],
                ['highlight', 'Parte destacada del título', 'para negocios'],
                ['description', 'Descripción', 'Trabajamos con cafeterías, eventos y comercios que buscan productos de calidad artesanal, con identidad y sabor real.', true],
                ['stat1Title', 'Destacado 1: título', 'Fresco'], ['stat1Text', 'Destacado 1: texto', 'producción a pedido'],
                ['stat2Title', 'Destacado 2: título', 'Flexible'], ['stat2Text', 'Destacado 2: texto', 'volumen según demanda'],
                ['stat3Title', 'Destacado 3: título', 'Directo'], ['stat3Text', 'Destacado 3: texto', 'trato sin intermediarios'],
                ['place1', 'Tipo de negocio 1', 'Cafeterías'], ['place2', 'Tipo de negocio 2', 'Eventos'],
                ['place3', 'Tipo de negocio 3', 'Comercios'], ['place4', 'Tipo de negocio 4', 'Restaurantes'],
                ['place5', 'Tipo de negocio 5', 'Catering'],
                ['contactButton', 'Botón del formulario', 'Consultar ahora'],
                ['whatsappButton', 'Botón de WhatsApp', 'WhatsApp directo'],
                ['qualityTitle', 'Sello de calidad: título', 'Calidad garantizada'],
                ['qualityText', 'Sello de calidad: texto', 'Masa madre · Ingredientes frescos · Hecho en el día'],
            ]),
            section('why', 'Por qué elegir Crosti', [
                ['title', 'Título', '¿Por qué elegir Crosti?'], ['subtitle', 'Subtítulo', 'Lo que nos hace diferentes'],
                ['card1Title', 'Beneficio 1: título', 'Producción artesanal'],
                ['card1Text', 'Beneficio 1: descripción', 'Cada focaccia hecha a mano con masa madre. Calidad que se nota desde la primera mordida.', true],
                ['card2Title', 'Beneficio 2: título', 'Ingredientes de calidad'],
                ['card2Text', 'Beneficio 2: descripción', 'Seleccionamos ingredientes frescos y de temporada para garantizar el mejor sabor.', true],
                ['card3Title', 'Beneficio 3: título', 'Entregas programadas'],
                ['card3Text', 'Beneficio 3: descripción', 'Coordinamos horarios y frecuencias según las necesidades de tu negocio.', true],
                ['card4Title', 'Beneficio 4: título', 'Opciones vegetarianas'],
                ['card4Text', 'Beneficio 4: descripción', 'Toda nuestra línea es apta para vegetarianos. Ideal para públicos diversos.', true],
                ['card5Title', 'Beneficio 5: título', 'Pedidos personalizados'],
                ['card5Text', 'Beneficio 5: descripción', 'Adaptamos las cantidades y variedades a lo que necesita tu negocio.', true],
                ['card6Title', 'Beneficio 6: título', 'Atención directa'],
                ['card6Text', 'Beneficio 6: descripción', 'Trato personal y directo. Sin intermediarios, con respuesta rápida siempre.', true],
            ]),
            section('process', 'El proceso', [
                ['title', 'Título', 'El proceso'], ['subtitle', 'Subtítulo', 'Cómo funciona'],
                ['step1Title', 'Paso 1: título', 'Contacto'],
                ['step1Text', 'Paso 1: descripción', 'Completá el formulario o escribinos por WhatsApp con los datos de tu negocio.', true],
                ['step2Title', 'Paso 2: título', 'Definir cantidades'],
                ['step2Text', 'Paso 2: descripción', 'Te asesoramos sobre variedades, volúmenes y precios según tus necesidades.', true],
                ['step3Title', 'Paso 3: título', 'Coordinación'],
                ['step3Text', 'Paso 3: descripción', 'Acordamos días, horarios y modalidad de entrega o retiro.', true],
                ['step4Title', 'Paso 4: título', 'Producción y envío'],
                ['step4Text', 'Paso 4: descripción', 'Producimos fresco y entregamos puntual para que tu negocio brille.', true],
            ]),
            section('contact', 'Contacto y formulario', [
                ['title', 'Título', 'Contacto mayorista'], ['subtitle', 'Subtítulo', 'Hablemos de tu negocio'],
                ['nameLabel', 'Etiqueta: nombre', 'Nombre *'], ['namePlaceholder', 'Ejemplo: nombre', 'Tu nombre'],
                ['businessLabel', 'Etiqueta: negocio', 'Negocio / Empresa'], ['businessPlaceholder', 'Ejemplo: negocio', 'Nombre de tu local o empresa'],
                ['socialLabel', 'Etiqueta: redes', 'Instagram o web'], ['socialPlaceholder', 'Ejemplo: redes', '@tunegocio o www.tunegocio.com'],
                ['phoneLabel', 'Etiqueta: teléfono', 'Teléfono *'], ['phonePlaceholder', 'Ejemplo: teléfono', 'Tu numero de contacto'],
                ['detailsLabel', 'Etiqueta: consulta', 'Contanos sobre tu negocio'],
                ['detailsPlaceholder', 'Ejemplo: consulta', '¿Qué tipo de local tenés? ¿Para qué ocasión necesitás las focaccias? Cualquier detalle que nos ayude a preparar la mejor propuesta...', true],
                ['button', 'Botón de envío', 'Consultar por WhatsApp'],
                ['footnote', 'Aclaración del formulario', 'Al enviar, te abrimos WhatsApp con toda la info precargada. Tu consulta también queda guardada para hacerte seguimiento.', true],
            ]),
            section('nav', 'Navegación', [['back', 'Botón para volver', 'Volver al sitio'], ['contact', 'Contacto', 'Contacto']]),
            footer,
        ],
    },
};

type ImageInput = [key: string, label: string, path: string, hint?: string];
const decorationHint = 'Para personajes, logos y decoraciones, usá PNG o WebP con fondo transparente.';
const photoHint = 'Usá una imagen de buena calidad. Se ajustará al espacio de la foto actual.';
const pageImages: Record<ContentPage, Record<string, ImageInput[]>> = {
    home: {
        banner: [
            ['image', 'Foto principal', '/wholesalers/HeroImage.webp', photoHint],
            ['character', 'Personaje de la portada', '/personajes/crosti-original.svg'],
            ['stickerLeft', 'Decoración izquierda', '/stickersAdicionales/cherry-tomatoes.png'],
            ['stickerRight', 'Decoración derecha', '/stickersAdicionales/focaccia-piece.png'],
        ],
        about: [['character', 'Personaje junto al título', '/personajes/crosti-original.svg'], ['image', 'Imagen principal de Sobre Crosti', '/personajes/crosti_original.webp']],
        order: [['stickerLeft', 'Decoración izquierda', '/stickersAdicionales/garlic-clove.png'], ['stickerRight', 'Decoración derecha', '/stickersAdicionales/onion-rings.png']],
        faq: [['image', 'Personaje de preguntas frecuentes', '/personajes/crosti-lentes-de-sol.svg']],
        contact: [['character', 'Personaje de contacto', '/personajes/crosti-lentes-de-sol.svg'], ['sticker', 'Decoración de contacto', '/stickersAdicionales/herb-sprigs.png']],
        nav: [['logo', 'Logo del encabezado', '/personajes/crosti-logo.svg']],
        footer: [['logo', 'Logo del pie de página', '/personajes/crosti-logo.svg']],
    },
    wholesalers: {
        hero: [['image', 'Foto principal', '/wholesalers/HeroImage.webp', photoHint]],
        why: [['stickerLeft', 'Decoración izquierda', '/stickersAdicionales/vine-leaf.png'], ['stickerRight', 'Decoración derecha', '/stickersAdicionales/artichoke.png']],
        process: [['stickerLeft', 'Decoración izquierda', '/stickersAdicionales/garlic-clove.png'], ['stickerRight', 'Decoración derecha', '/stickersAdicionales/onion-rings.png']],
        contact: [['stickerLeft', 'Decoración izquierda', '/stickersAdicionales/cherry-tomatoes.png'], ['stickerRight', 'Decoración derecha', '/stickersAdicionales/cheese-wedge.png']],
        nav: [['logo', 'Logo del encabezado', '/personajes/crosti-logo.svg']],
        footer: [['logo', 'Logo del pie de página', '/personajes/crosti-logo.svg']],
    },
};

export const contentPages = Object.fromEntries(Object.entries(textPages).map(([page, definition]) => [page, {
    ...definition,
    sections: definition.sections.map((section) => ({
        ...section,
        fields: [...section.fields, ...(pageImages[page as ContentPage][section.id] ?? []).map(([key, label, defaultValue, hint]): ContentField => ({
            key: `${section.id}.${key}`, label, defaultValue, multiline: false, maxLength: 2048, image: { hint: hint ?? decorationHint },
        }))],
    })),
}])) as typeof textPages;

export const CONTENT_IMAGE_MAX_BYTES = 4 * 1024 * 1024;
export const CONTENT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function contentImagePublicId(value: string, cloudName?: string): string | null {
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || url.port || url.username || url.password || url.search || url.hash) return null;
        const match = url.pathname.match(/^\/([^/]+)\/image\/upload\/v\d+\/(content\/[a-zA-Z0-9_-]+)\.(?:jpg|jpeg|png|webp)$/);
        if (!match || (cloudName && match[1] !== cloudName)) return null;
        return match[2];
    } catch { return null; }
}

export function isContentPage(value: unknown): value is ContentPage {
    return value === 'home' || value === 'wholesalers';
}

export function defaultContent(page: ContentPage): ContentValues {
    return Object.fromEntries(contentPages[page].sections.flatMap(({ fields }) => fields.map(({ key, defaultValue }) => [key, defaultValue])));
}

// Merge known fields only. Newly introduced fields keep their default copy.
export function publishedValues(page: ContentPage, saved: unknown): ContentValues {
    const values = defaultContent(page);
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        for (const key of Object.keys(values)) {
            const value = (saved as Record<string, unknown>)[key];
            if (typeof value === 'string' && value.trim()) values[key] = value;
        }
    }
    return values;
}

export function validateContent(page: ContentPage, input: unknown, options: { allowLocalImages?: boolean; cloudName?: string } = {}): { values: ContentValues; errors: Record<string, string> } {
    const values: ContentValues = {};
    const errors: Record<string, string> = {};
    const source = input && typeof input === 'object' && !Array.isArray(input) ? input as Record<string, unknown> : {};
    const fields = contentPages[page].sections.flatMap(({ fields }) => fields);
    const keys = new Set(fields.map(({ key }) => key));
    if (Object.keys(source).some((key) => !keys.has(key))) errors._form = 'Hay campos desconocidos. Recargá el editor antes de guardar.';
    for (const field of fields) {
        const value = source[field.key];
        if (typeof value !== 'string' || !value.trim()) errors[field.key] = 'Completá este texto.';
        else if (value.length > field.maxLength) errors[field.key] = `Usá hasta ${field.maxLength} caracteres.`;
        else if (field.image && value !== field.defaultValue && !contentImagePublicId(value, options.cloudName) && !(options.allowLocalImages && /^blob:https?:\/\//.test(value))) errors[field.key] = 'Elegí una imagen válida desde el selector.';
        else values[field.key] = value.trim();
    }
    return { values, errors };
}
