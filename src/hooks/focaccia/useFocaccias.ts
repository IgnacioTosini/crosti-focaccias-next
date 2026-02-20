import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/ProductService';

export const useFocaccias = () => {
    return useQuery({
        queryKey: ['focaccias'],
        queryFn: ProductService.getFocaccias,
        staleTime: 1000 * 60 * 60 * 24, // 24 horas
    },
    )
};
