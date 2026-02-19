import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/ProductService';

export const useFocaccias = () => {
    return useQuery({
        queryKey: ['focaccias'],
        queryFn: ProductService.getFocaccias,
    });
};
