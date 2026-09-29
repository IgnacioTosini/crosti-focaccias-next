import assert from 'node:assert/strict';
import test from 'node:test';
import { contentPages, defaultContent, contentImagePublicId, isContentPage, publishedValues, validateContent } from './siteContent.ts';

test('ambas páginas tienen textos originales válidos y claves únicas', () => {
    for (const page of ['home', 'wholesalers']) {
        const fields = contentPages[page].sections.flatMap(({ fields }) => fields);
        assert.equal(new Set(fields.map(({ key }) => key)).size, fields.length);
        const defaults = defaultContent(page);
        assert.deepEqual(validateContent(page, defaults), { values: defaults, errors: {} });
    }
});

test('rechaza páginas desconocidas y claves especiales', () => {
    for (const page of ['__proto__', 'constructor', '../home', null, {}, 'HOME']) assert.equal(isContentPage(page), false);
    assert.equal(isContentPage('home'), true);
    assert.equal(isContentPage('wholesalers'), true);
});

test('un guardado parcial o mal formado nunca borra el resto de los textos', () => {
    for (const invalid of [null, [], 'texto', { 'banner.title': 'Nuevo título' }]) {
        assert.ok(Object.keys(validateContent('home', invalid).errors).length > 0);
    }
    const values = defaultContent('home');
    values['banner.title'] = 42;
    values['about.title'] = '   ';
    const { errors } = validateContent('home', values);
    assert.ok(errors['banner.title']);
    assert.ok(errors['about.title']);
});

test('valida longitudes y campos desconocidos antes de publicar', () => {
    const values = defaultContent('wholesalers');
    values['hero.title'] = 'a'.repeat(251);
    values['hero.description'] = 'a'.repeat(2001);
    values['inventado'] = 'No se debe guardar';
    const { errors } = validateContent('wholesalers', values);
    assert.ok(errors['hero.title']);
    assert.ok(errors['hero.description']);
    assert.ok(errors._form);
});

test('normaliza espacios sin modificar el borrador ni los valores por defecto', () => {
    const draft = defaultContent('home');
    draft['banner.title'] = '  Nuevo título  ';
    const result = validateContent('home', draft);
    assert.equal(result.values['banner.title'], 'Nuevo título');
    assert.equal(draft['banner.title'], '  Nuevo título  ');
    assert.equal(defaultContent('home')['banner.title'], 'La ola de sabor en');
});

test('versiones anteriores reciben nuevos campos y no inyectan claves ajenas', () => {
    const merged = publishedValues('home', { 'banner.title': 'Título guardado', 'about.title': null, extra: 'Ignorar' });
    assert.equal(merged['banner.title'], 'Título guardado');
    assert.equal(merged['about.title'], defaultContent('home')['about.title']);
    assert.equal(merged.extra, undefined);
    assert.equal(Object.keys(merged).length, Object.keys(defaultContent('home')).length);
});

test('las imágenes originales se conservan al leer documentos anteriores', () => {
    const old = { 'banner.title': 'Título ya publicado' };
    const merged = publishedValues('home', old);
    assert.equal(merged['banner.image'], '/wholesalers/HeroImage.webp');
    assert.equal(merged['banner.title'], old['banner.title']);
    assert.equal(merged['nav.logo'], '/personajes/crosti-logo.svg');
});

test('las imágenes locales del borrador se aceptan solamente en la vista previa', () => {
    const values = defaultContent('home');
    values['banner.image'] = 'blob:http://localhost:3000/12345678';
    assert.ok(validateContent('home', values).errors['banner.image']);
    assert.deepEqual(validateContent('home', values, { allowLocalImages: true }).errors, {});
});

test('solo se guardan imágenes de content con URLs de entrega válidas', () => {
    const url = 'https://res.cloudinary.com/crosti/image/upload/v123/content/image-123.webp';
    assert.equal(contentImagePublicId(url, 'crosti'), 'content/image-123');
    assert.equal(contentImagePublicId(url, 'otro-cloud'), null);
    const values = defaultContent('home');
    values['banner.image'] = url;
    assert.deepEqual(validateContent('home', values, { cloudName: 'crosti' }).errors, {});
    const bad = [
        '/api/admin/contenido/home', 'javascript:alert(1)', 'data:image/svg+xml,invalid',
        'https://example.com/image.png', url.replace('/content/', '/products/'),
        url.replace('.webp', '.svg'), url.replace('https:', 'http:'), `${url}?x=1`, `${url}#fragment`,
        'https://attacker@res.cloudinary.com/crosti/image/upload/v123/content/image-123.webp',
    ];
    for (const image of bad) {
        values['banner.image'] = image;
        assert.ok(validateContent('home', values).errors['banner.image'], image);
    }
});
