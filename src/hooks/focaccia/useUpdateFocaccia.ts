import { ProductServiceServer } from "@/services/ProductServiceServer";
import { FocacciaItem } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateFocaccia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: FocacciaItem }) =>
            ProductServiceServer.updateFocaccia(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["focaccias"] });
            queryClient.invalidateQueries({ queryKey: ["focaccia", variables.id] });
        },
    });
};
