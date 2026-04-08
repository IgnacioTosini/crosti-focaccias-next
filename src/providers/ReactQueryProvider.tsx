'use client'

import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { useState } from 'react'

const PRODUCTS_CACHE_TIME = 1000 * 60 * 30
const PERSISTED_CACHE_TIME = 1000 * 60 * 60 * 24

const noopStorage = {
    getItem: (key: string) => {
        void key
        return null
    },
    setItem: (key: string, value: string) => {
        void key
        void value
        return undefined
    },
    removeItem: (key: string) => {
        void key
        return undefined
    },
}

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {

    const [queryClient] = useState(() =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: PRODUCTS_CACHE_TIME,
                    gcTime: PERSISTED_CACHE_TIME,
                    refetchOnMount: false,
                    refetchOnWindowFocus: false,
                    retry: 1,
                },
            },
        })
    )

    const [persister] = useState(() =>
        createSyncStoragePersister({
            storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
        })
    )

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: PERSISTED_CACHE_TIME,
                buster: "crosti-v3"
            }}
            onSuccess={() => {
                queryClient.resumePausedMutations()
            }}
        >
            {children}
        </PersistQueryClientProvider>
    )
}