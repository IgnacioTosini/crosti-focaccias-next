'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { defaultContent, type ContentPage, type ContentValues } from '@/lib/siteContent';

const ContentContext = createContext<ContentValues | null>(null);

export function PageContentProvider({ page, values, children }: { page: ContentPage; values: ContentValues; children: ReactNode }) {
    return <ContentContext.Provider value={{ ...defaultContent(page), ...values }}>{children}</ContentContext.Provider>;
}

export function usePageText() {
    const values = useContext(ContentContext);
    const fallback = defaultContent('home');
    return (key: string) => values?.[key] ?? fallback[key] ?? '';
}
