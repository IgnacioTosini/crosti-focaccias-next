'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useState, useEffect } from 'react'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {

    const [queryClient] = useState(() =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 60 * 24, // 24 horas
                    gcTime: 1000 * 60 * 60 * 24,    // 24 horas
                    refetchOnWindowFocus: false,
                    retry: 2,
                },
            },
        })
    )

    useEffect(() => {
        const persister = createSyncStoragePersister({
            storage: window.localStorage,
        })

        persistQueryClient({
            queryClient,
            persister,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
        })
    }, [queryClient])

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
