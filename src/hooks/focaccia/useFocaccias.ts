import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/ProductService';

export const useFocaccias = () => {
    return useQuery({
        queryKey: ['focaccias'],
        queryFn: async () => {
            const res = await ProductService.getFocaccias();
            return res.data;
        },
        staleTime: 1000 * 60 * 60 * 4, // 4 horas
    },
    )
};
