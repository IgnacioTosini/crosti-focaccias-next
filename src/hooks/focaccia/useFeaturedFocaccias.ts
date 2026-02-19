import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/ProductService";

export const useFeaturedFocaccias = () => {
    return useQuery({
        queryKey: ["featuredFocaccias"],
        queryFn: ProductService.getFeaturedFocaccias,
    });
};
