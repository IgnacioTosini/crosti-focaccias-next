import { updateFocacciaAction } from "@/app/actions/focaccia.actions";
import { FocacciaCreate, FocacciaItem } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ProductCache } from "@/services/ProductService";

export const useUpdateFocaccia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: FocacciaCreate }) =>
            updateFocacciaAction(id, data),
        onSuccess: (updated, variables) => {
            const normalizedUpdated = {
                ...updated,
                price: updated.mediumPrice,
                pedidos: [],
            } as FocacciaItem;

            queryClient.setQueryData<FocacciaItem[]>(["focaccias"], (current = []) =>
                current.map((item) =>
                    item.id === variables.id ? { ...item, ...normalizedUpdated } : item
                )
            );

            queryClient.setQueryData<FocacciaItem | undefined>(["focaccia", variables.id], (current) => {
                if (!current) return normalizedUpdated;
                return { ...current, ...normalizedUpdated };
            });

            queryClient.setQueryData<FocacciaItem[]>(["featuredFocaccias"], (current = []) => {
                const withoutUpdated = current.filter((item) => item.id !== normalizedUpdated.id);
                if (!normalizedUpdated.featured) return withoutUpdated;
                return [normalizedUpdated, ...withoutUpdated];
            });

            const syncedFocaccias = queryClient.getQueryData<FocacciaItem[]>(["focaccias"]) ?? [];
            ProductCache.write(syncedFocaccias);
        },
        onSettled: (_, __, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["focaccias"] });
            void queryClient.invalidateQueries({ queryKey: ["focaccia", variables.id] });
            void queryClient.invalidateQueries({ queryKey: ["featuredFocaccias"] });
        },
    });
};
