import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFocacciaAction } from "@/app/actions/focaccia.actions";
import type { FocacciaItem } from "@/types";

export const useCreateFocaccia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFocacciaAction,
        onSuccess: (created) => {
            const normalizedCreated = {
                ...created,
                pedidos: [],
            } as FocacciaItem;

            queryClient.setQueryData<FocacciaItem[]>(["focaccias"], (current = []) => {
                const withoutCreated = current.filter((item) => item.id !== normalizedCreated.id);
                return [normalizedCreated, ...withoutCreated];
            });

            if (normalizedCreated.featured) {
                queryClient.setQueryData<FocacciaItem[]>(["featuredFocaccias"], (current = []) => {
                    const withoutCreated = current.filter((item) => item.id !== normalizedCreated.id);
                    return [normalizedCreated, ...withoutCreated];
                });
            }

            queryClient.invalidateQueries({ queryKey: ["focaccias"], refetchType: "inactive" });
            if (normalizedCreated.featured) {
                queryClient.invalidateQueries({ queryKey: ["featuredFocaccias"], refetchType: "inactive" });
            }
        },
    });
};
