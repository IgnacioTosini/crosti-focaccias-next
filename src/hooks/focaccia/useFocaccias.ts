import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/ProductService';
import type { FocacciaItem } from '@/types';

const PRODUCTS_CACHE_TIME = 1000 * 60 * 30;

type UseFocacciasOptions = {
    live?: boolean;
    refetchIntervalMs?: number;
};

export const useFocaccias = (
    initialData?: FocacciaItem[],
    options?: UseFocacciasOptions
) => {
    const hasInitialData = Array.isArray(initialData) && initialData.length > 0;
    const isLive = options?.live ?? false;
    const refetchIntervalMs = options?.refetchIntervalMs ?? 15000;

    return useQuery({
        queryKey: ['focaccias'],
        queryFn: ProductService.getFocaccias,
        staleTime: PRODUCTS_CACHE_TIME,
        initialData: hasInitialData ? initialData : undefined,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
        refetchOnReconnect: 'always',
        refetchInterval: isLive ? refetchIntervalMs : false,
        refetchIntervalInBackground: isLive,
        placeholderData: (previousData) => previousData,
    });
};
