import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/ProductService';
import type { FocacciaItem } from '@/types';

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
    // refetchIntervalMs funciona tanto en live (admin) como en público (OurMenu)
    const refetchIntervalMs = options?.refetchIntervalMs;

    return useQuery({
        queryKey: ['focaccias'],
        queryFn: ProductService.getFocaccias,
        // Admin (live): staleTime 0 — igual que usePromociones en admin
        // Público: 10 minutos — igual que usePromociones en público
        staleTime: isLive ? 0 : 1000 * 60 * 10,
        // Sin initialData: la caché arranca vacía y siempre fetchea (mismo patrón
        // que usePromociones/CombosSection). Los datos SSR se muestran como
        // placeholder para evitar flash de carga sin bloquear actualizaciones.
        placeholderData: (previousData) =>
            previousData ?? (hasInitialData ? initialData : undefined),
        refetchOnMount: isLive ? 'always' : true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: 'always',
        // Sin intervalo explícito → false (sin polling)
        refetchInterval: refetchIntervalMs ?? false,
        refetchIntervalInBackground: isLive,
    });
};
