import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/ProductService';
import type { FocacciaItem } from '@/types';

const PRODUCTS_CACHE_TIME = 1000 * 60 * 30;

export const useFocaccias = (initialData?: FocacciaItem[]) => {
    return useQuery({
        queryKey: ['focaccias'],
        queryFn: ProductService.getFocaccias,
        staleTime: PRODUCTS_CACHE_TIME,
        initialData,
        initialDataUpdatedAt: initialData?.length ? Date.now() : undefined,
        placeholderData: (previousData) => previousData,
    });
};
