'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { HomePage } from '@/components/sections/home/HomePage/HomePage';
import { WholesalersPageContent } from '@/components/sections/wholesalers/WholesalersPageContent';
import { PageContentProvider } from './PageContentProvider';
import { validateContent, type ContentPage, type ContentValues } from '@/lib/siteContent';
import type { FocacciaItem } from '@/types';

export function ContentPreview({ page, initialFocaccias }: { page: ContentPage; initialFocaccias?: FocacciaItem[] }) {
    const [values, setValues] = useState<ContentValues | null>(null);
    useEffect(() => {
        const receive = (event: MessageEvent) => {
            if (event.origin !== window.location.origin || event.source !== window.parent || window.parent === window) return;
            if (event.data?.type !== 'crosti:preview-content' || event.data.page !== page) return;
            const result = validateContent(page, event.data.values, { allowLocalImages: true });
            if (Object.keys(result.errors).length === 0) setValues(result.values);
        };
        window.addEventListener('message', receive);
        window.parent.postMessage({ type: 'crosti:preview-ready', page }, window.location.origin);
        return () => window.removeEventListener('message', receive);
    }, [page]);

    function preventActions(event: MouseEvent<HTMLDivElement>) {
        const target = (event.target as Element).closest('a, button');
        if (!target || target.matches('.mobileMenuButton')) return;
        if (target.matches('a') && target.getAttribute('href')?.startsWith('#')) return;
        event.preventDefault();
        event.stopPropagation();
    }

    if (!values) return <p role='status' style={{ padding: '2rem', textAlign: 'center' }}>Preparando la vista previa… Abrila desde el editor de contenido.</p>;
    return (
        <div onClickCapture={preventActions} onSubmitCapture={(event) => { event.preventDefault(); event.stopPropagation(); }}>
            <PageContentProvider page={page} values={values}>
                {page === 'home' ? <HomePage initialFocaccias={initialFocaccias} preview /> : <WholesalersPageContent />}
            </PageContentProvider>
        </div>
    );
}
