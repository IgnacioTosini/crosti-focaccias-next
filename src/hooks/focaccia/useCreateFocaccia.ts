import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductServiceServer } from "@/services/ProductServiceServer";

export const useCreateFocaccia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ProductServiceServer.createFocaccia,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["focaccias"] });
            queryClient.invalidateQueries({ queryKey: ["featuredFocaccias"] });
        },
    });
};
