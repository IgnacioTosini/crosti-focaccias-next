import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/ProductService";

const PRODUCTS_CACHE_TIME = 1000 * 60 * 30;

export const useFeaturedFocaccias = () => {
    return useQuery({
        queryKey: ["featuredFocaccias"],
        queryFn: ProductService.getFeaturedFocaccias,
        staleTime: PRODUCTS_CACHE_TIME,
        placeholderData: (previousData) => previousData,
    });
};
