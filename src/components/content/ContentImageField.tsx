'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FaImage, FaUndo } from 'react-icons/fa';
import type { ContentField } from '@/lib/siteContent';

export function ContentImageField({ id, field, value, savedValue, error, disabled, onSelect, onRestore }: {
    id: string; field: ContentField; value: string; savedValue: string; error?: string; disabled: boolean;
    onSelect: (file: File) => void; onRestore: (value: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!value.startsWith('blob:') && inputRef.current) inputRef.current.value = '';
    }, [value]);

    return <div className='content-editor__image-field'>
        <label htmlFor={id}>{field.label}</label>
        <div className='content-editor__image-preview'>
            <Image src={value} alt={`Imagen seleccionada: ${field.label}`} fill unoptimized sizes='(max-width: 700px) 100vw, 480px' />
        </div>
        <p id={`${id}-hint`}>{field.image?.hint} JPG, PNG o WebP, hasta 4 MB.</p>
        <input ref={inputRef} id={id} name={field.key} type='file' accept='image/jpeg,image/png,image/webp' disabled={disabled} aria-invalid={!!error} aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`} onClick={(event) => { event.currentTarget.value = ''; }} onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) onSelect(file);
        }} />
        <div className='content-editor__image-tools'>
            {value !== savedValue && <button type='button' disabled={disabled} onClick={() => onRestore(savedValue)}><FaUndo aria-hidden='true' /> Deshacer cambio</button>}
            {value !== field.defaultValue && <button type='button' disabled={disabled} onClick={() => onRestore(field.defaultValue)}><FaImage aria-hidden='true' /> Usar original</button>}
        </div>
        {error && <p id={`${id}-error`} className='content-editor__image-error' role='alert'>{error}</p>}
    </div>;
}
