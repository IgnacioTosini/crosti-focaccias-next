import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/ProductService";

export const useFocaccia = (id: number) => {
    return useQuery({
        queryKey: ["focaccia", id],
        queryFn: () => ProductService.getFocacciaById(id),
        enabled: !!id,
    });
};
