'use client';

import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaChevronDown, FaDesktop, FaEye, FaMobileAlt, FaSave, FaTimes } from 'react-icons/fa';
import { contentPages, validateContent, CONTENT_IMAGE_MAX_BYTES, CONTENT_IMAGE_TYPES, type ContentDocument, type ContentPage, type ContentValues } from '@/lib/siteContent';
import { ContentImageField } from '@/components/content/ContentImageField';
import './_contenido.scss';

type EditorState = Record<ContentPage, { saved: ContentDocument; draft: ContentValues }>;
type PendingImage = { file: File; localUrl: string; uploadedUrl?: string };
const pages: ContentPage[] = ['home', 'wholesalers'];

export default function ContentAdminPage() {
    const [editor, setEditor] = useState<EditorState | null>(null);
    const [page, setPage] = useState<ContentPage>('home');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preparingImage, setPreparingImage] = useState(false);
    const [saveProgress, setSaveProgress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [preview, setPreview] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const formRef = useRef<HTMLFormElement>(null);
    const pendingImages = useRef<Record<ContentPage, Record<string, PendingImage>>>({ home: {}, wholesalers: {} });
    const mounted = useRef(true);
    const busy = saving || preparingImage;
    const current = editor?.[page];
    const changed = (key: ContentPage) => editor ? Object.keys(editor[key].draft).filter((field) => editor[key].draft[field] !== editor[key].saved.values[field]).length : 0;
    const hasUnsavedChanges = pages.some((key) => changed(key) > 0);
    const count = changed(page);

    useEffect(() => {
        mounted.current = true;
        const pending = pendingImages.current;
        return () => {
            mounted.current = false;
            for (const page of pages) for (const image of Object.values(pending[page])) URL.revokeObjectURL(image.localUrl);
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            try {
                const records = await Promise.all(pages.map(async (key) => {
                    const response = await fetch(`/api/admin/contenido/${key}`, { cache: 'no-store', signal: controller.signal });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message || 'No pudimos cargar el contenido.');
                    const saved = result.data as ContentDocument;
                    return [key, { saved, draft: { ...saved.values } }];
                }));
                if (!controller.signal.aborted) setEditor(Object.fromEntries(records) as EditorState);
            } catch (cause) {
                if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'No pudimos cargar el contenido.');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        void load();
        return () => controller.abort();
    }, [attempt]);

    useEffect(() => {
        if (!hasUnsavedChanges) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [hasUnsavedChanges]);

    function edit(key: string, value: string) {
        setEditor((state) => state && ({ ...state, [page]: { ...state[page], draft: { ...state[page].draft, [key]: value } } }));
        setFieldErrors((previous) => { const next = { ...previous }; delete next[key]; return next; });
        setMessage('');
    }

    function releaseImage(key: string) {
        const pending = pendingImages.current[page][key];
        if (pending) URL.revokeObjectURL(pending.localUrl);
        delete pendingImages.current[page][key];
    }

    async function selectImage(key: string, file: File) {
        if (busy) return;
        if (!CONTENT_IMAGE_TYPES.includes(file.type) || file.size > CONTENT_IMAGE_MAX_BYTES || !file.size) {
            setFieldErrors((errors) => ({ ...errors, [key]: 'Elegí una imagen JPG, PNG o WebP de hasta 4 MB.' }));
            return;
        }
        setPreparingImage(true);
        const localUrl = URL.createObjectURL(file);
        try {
            const image = new window.Image();
            image.src = localUrl;
            await image.decode();
            if (!mounted.current) { URL.revokeObjectURL(localUrl); return; }
            releaseImage(key);
            pendingImages.current[page][key] = { file, localUrl };
            edit(key, localUrl);
            setError('');
        } catch {
            URL.revokeObjectURL(localUrl);
            if (mounted.current) setFieldErrors((errors) => ({ ...errors, [key]: 'No pudimos abrir esa imagen. Elegí otro archivo.' }));
        } finally {
            if (mounted.current) setPreparingImage(false);
        }
    }

    function validate() {
        if (!current) return null;
        const result = validateContent(page, current.draft, { allowLocalImages: true });
        setFieldErrors(result.errors);
        if (Object.keys(result.errors).length) {
            setError('Revisá los campos marcados antes de continuar.');
            const input = formRef.current?.elements.namedItem(Object.keys(result.errors)[0]) as HTMLElement | null;
            const section = input?.closest('details');
            if (section) section.open = true;
            requestAnimationFrame(() => input?.focus());
            return null;
        }
        setError('');
        return result.values;
    }

    async function save() {
        const values = validate();
        if (!values || !current || busy) return;
        setSaving(true);
        setMessage('');
        try {
            const images = Object.entries(pendingImages.current[page]).filter(([key, image]) => values[key] === image.localUrl);
            for (const [index, [key, image]] of images.entries()) {
                setSaveProgress(`Subiendo imagen ${index + 1} de ${images.length}…`);
                if (!image.uploadedUrl) {
                    const form = new FormData();
                    form.append('file', image.file);
                    const upload = await fetch('/api/admin/contenido/imagenes', { method: 'POST', body: form });
                    const result = await upload.json();
                    if (!upload.ok) throw new Error(result.message || 'No pudimos subir la imagen. Tu borrador se conserva.');
                    image.uploadedUrl = result.url as string;
                }
                values[key] = image.uploadedUrl;
            }
            setSaveProgress('Publicando cambios…');
            const response = await fetch(`/api/admin/contenido/${page}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values, revision: current.saved.revision }),
            });
            const result = await response.json();
            if (!response.ok) {
                if (result.errors) setFieldErrors(result.errors);
                throw new Error(result.message || 'No pudimos guardar los cambios.');
            }
            const saved = result.data as ContentDocument;
            setEditor((state) => state && ({ ...state, [page]: { saved, draft: { ...saved.values } } }));
            setMessage(`El contenido de ${contentPages[page].label} ya está publicado.`);
            setPreview(false);
            for (const key of Object.keys(pendingImages.current[page])) releaseImage(key);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'No pudimos guardar los cambios. Tu borrador sigue en el editor.');
        } finally {
            setSaving(false);
            setSaveProgress('');
        }
    }

    function cancel() {
        for (const key of Object.keys(pendingImages.current[page])) releaseImage(key);
        setEditor((state) => state && ({ ...state, [page]: { ...state[page], draft: { ...state[page].saved.values } } }));
        setFieldErrors({});
        setError('');
        setMessage('Cambios descartados. Volviste al contenido guardado de esta página.');
        setPreview(false);
    }

    return (
        <div className='content-editor'>
            <header className='content-editor__heading'>
                <div><span className='content-editor__eyebrow'>TU SITIO, A TU MANERA</span><h1>Contenido del sitio</h1><p>Editá textos e imágenes, revisá cómo quedan y publicá cuando estén listos.</p></div>
            </header>
            {loading ? <div className='content-editor__notice' role='status'>Cargando el contenido guardado…</div> : !editor ? (
                <div className='content-editor__notice content-editor__notice--error' role='alert'><p>{error}</p><button type='button' onClick={() => { setLoading(true); setError(''); setAttempt((value) => value + 1); }}>Reintentar</button></div>
            ) : current && (
                <>
                    <div className='content-editor__pages' aria-label='Página a editar'>
                        {pages.map((key) => (
                            <button type='button' key={key} aria-pressed={page === key} disabled={busy} onClick={() => { setPage(key); setFieldErrors({}); setError(''); setMessage(''); }}>
                                <strong>{contentPages[key].label}{changed(key) > 0 && <span className='content-editor__dot' aria-label='Con cambios sin guardar' />}</strong><span>{contentPages[key].path}</span>
                            </button>
                        ))}
                    </div>
                    <div className='content-editor__page-info'>
                        <div><h2>Contenido de {contentPages[page].label}</h2><p>Los cambios se guardan por página. Podés cambiar de pestaña sin perder tu borrador.</p></div>
                        <span className={`content-editor__status ${count ? 'is-dirty' : ''}`}>{count ? `${count} ${count === 1 ? 'cambio pendiente' : 'cambios pendientes'}` : <><FaCheck aria-hidden='true' /> Sin cambios pendientes</>}</span>
                    </div>
                    <p className='content-editor__hint'>Las imágenes nuevas se suben al guardar. Podés probarlas en la vista previa y cancelar sin publicarlas. El catálogo se edita desde Focaccias y Combos.</p>
                    {(saveProgress || preparingImage) && <p className='content-editor__notice' role='status'>{preparingImage ? 'Preparando imagen…' : saveProgress}</p>}
                    {error && <p className='content-editor__notice content-editor__notice--error' role='alert'>{error}</p>}
                    {message && <p className='content-editor__notice content-editor__notice--success' role='status'>{message}</p>}
                    <form ref={formRef} onSubmit={(event) => { event.preventDefault(); void save(); }} noValidate>
                        <fieldset disabled={busy} className='content-editor__fields'>
                            <legend className='content-editor__sr-only'>Contenido de {contentPages[page].label}</legend>
                            {contentPages[page].sections.map((section, index) => (
                                <details className='content-editor__section' key={`${page}-${section.id}`} open={index === 0}>
                                    <summary><span className='content-editor__section-number'>{String(index + 1).padStart(2, '0')}</span><span><strong>{section.title}</strong><small>{section.fields.filter((field) => !field.image).length} textos{section.fields.some((field) => field.image) && ` · ${section.fields.filter((field) => field.image).length} imágenes`}</small></span><FaChevronDown aria-hidden='true' /></summary>
                                    <div className='content-editor__grid'>
                                        {section.fields.map((field) => {
                                            const id = `content-${page}-${field.key}`;
                                            const invalid = fieldErrors[field.key];
                                            if (field.image) return <ContentImageField key={field.key} id={id} field={field} value={current.draft[field.key]} savedValue={current.saved.values[field.key]} error={invalid} disabled={busy} onSelect={(file) => void selectImage(field.key, file)} onRestore={(value) => { releaseImage(field.key); edit(field.key, value); }} />;
                                            const props = { id, name: field.key, value: current.draft[field.key], maxLength: field.maxLength, required: true, 'aria-invalid': !!invalid, 'aria-describedby': invalid ? `${id}-error` : undefined, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => edit(field.key, event.target.value) };
                                            return <div className={`content-editor__field ${field.multiline ? 'is-wide' : ''}`} key={field.key}>
                                                <label htmlFor={id}>{field.label}</label>
                                                {field.multiline ? <textarea {...props} rows={4} /> : <input {...props} type='text' />}
                                                <div className='content-editor__field-footer'>{invalid && <span id={`${id}-error`}>{invalid}</span>}<small>{current.draft[field.key].length}/{field.maxLength}</small></div>
                                            </div>;
                                        })}
                                    </div>
                                </details>
                            ))}
                        </fieldset>
                        <div className='content-editor__actions'>
                            <div><strong>{count ? 'Tenés cambios sin publicar' : 'Todo al día'}</strong><span>{current.saved.updatedAt ? `Último guardado: ${new Date(current.saved.updatedAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Argentina/Buenos_Aires' })}` : 'Se muestran los textos originales del sitio.'}</span></div>
                            <div className='content-editor__buttons'>
                                <button type='button' disabled={!count || busy} onClick={cancel}><FaTimes aria-hidden='true' /> Cancelar</button>
                                <button type='button' disabled={busy} className='content-editor__preview-button' onClick={() => { if (validate()) setPreview(true); }}><FaEye aria-hidden='true' /> Vista previa</button>
                                <button type='submit' disabled={!count || busy} className='content-editor__save-button'><FaSave aria-hidden='true' /> {saving ? 'Guardando…' : 'Guardar cambios'}</button>
                            </div>
                        </div>
                    </form>
                    {preview && <PreviewDialog page={page} values={current.draft} saving={saving} dirty={count > 0} error={error} onClose={() => setPreview(false)} onSave={() => void save()} />}
                </>
            )}
        </div>
    );
}

function PreviewDialog({ page, values, saving, dirty, error, onClose, onSave }: { page: ContentPage; values: ContentValues; saving: boolean; dirty: boolean; error: string; onClose: () => void; onSave: () => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [size, setSize] = useState({ width: 1280, height: 720 });
    const [ready, setReady] = useState(false);
    const [slow, setSlow] = useState(false);
    const [reload, setReload] = useState(0);
    const frameWidth = device === 'mobile' ? 390 : 1280;
    const scale = Math.min(1, Math.max(1, size.width) / frameWidth);

    useEffect(() => {
        const dialog = dialogRef.current!;
        dialog.showModal();
        const previous = document.body.style.overflow;
        const previousRoot = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
        observer.observe(stageRef.current!);
        return () => { observer.disconnect(); document.body.style.overflow = previous; document.documentElement.style.overflow = previousRoot; dialog.close(); };
    }, []);

    useEffect(() => {
        const receive = (event: MessageEvent) => {
            if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
            if (event.data?.type === 'crosti:preview-ready' && event.data.page === page) {
                iframeRef.current?.contentWindow?.postMessage({ type: 'crosti:preview-content', page, values }, window.location.origin);
                setReady(true);
            }
        };
        window.addEventListener('message', receive);
        const timer = window.setTimeout(() => setSlow(true), 20_000);
        return () => { window.removeEventListener('message', receive); window.clearTimeout(timer); };
    }, [page, values, reload]);

    return <dialog ref={dialogRef} className='content-preview' aria-labelledby='preview-title' onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}>
        <header className='content-preview__toolbar'>
            <div><h2 id='preview-title'>Vista previa · {contentPages[page].label}</h2><p>{dirty ? 'Así se verá tu página. Todavía no publicaste los cambios.' : 'Así se ve tu página con los textos guardados.'}</p></div>
            <div className='content-preview__devices' aria-label='Tamaño de vista previa'><button type='button' aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><FaDesktop aria-hidden='true' /><span>Escritorio</span></button><button type='button' aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}><FaMobileAlt aria-hidden='true' /><span>Celular</span></button></div>
            <button type='button' className='content-preview__close' aria-label='Cerrar vista previa' onClick={onClose} disabled={saving}><FaTimes aria-hidden='true' /></button>
        </header>
        {error && <p className='content-editor__notice content-editor__notice--error' role='alert'>{error}</p>}
        <div className='content-preview__stage' ref={stageRef}>
            {!ready && <div className='content-preview__loading' role='status'><p>{slow ? 'La vista previa está tardando. Podés reintentar o volver al editor.' : 'Preparando tu página…'}</p>{slow && <button type='button' onClick={() => { setReady(false); setSlow(false); setReload((value) => value + 1); }}>Reintentar</button>}</div>}
            <div className='content-preview__frame' style={{ width: frameWidth * scale, height: size.height }}>
                <iframe key={reload} ref={iframeRef} title={`Vista previa de ${contentPages[page].label}`} src={`/preview/${page}`} sandbox='allow-scripts allow-same-origin' style={{ width: frameWidth, height: size.height / scale, transform: `scale(${scale})` }} />
            </div>
        </div>
        <footer className='content-preview__footer'><p>Los botones de compra y envío están desactivados en esta vista.</p><div className='content-editor__buttons'><button type='button' disabled={saving} onClick={onClose}>Volver a editar</button><button type='button' disabled={!dirty || saving || !ready} className='content-editor__save-button' onClick={onSave}><FaSave aria-hidden='true' />{saving ? 'Guardando…' : 'Guardar cambios'}</button></div></footer>
    </dialog>;
}
