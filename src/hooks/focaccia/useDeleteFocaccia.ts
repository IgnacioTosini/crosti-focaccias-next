import { deleteFocacciaAction } from "@/app/actions/focaccia.actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { FocacciaItem } from "@/types"
import { ProductCache } from "@/services/ProductService"

export const useDeleteFocaccia = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteFocacciaAction,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<FocacciaItem[]>(['focaccias'], (current = []) =>
                current.filter((item) => item.id !== deletedId)
            )

            queryClient.setQueryData<FocacciaItem[]>(['featuredFocaccias'], (current = []) =>
                current.filter((item) => item.id !== deletedId)
            )

            queryClient.removeQueries({ queryKey: ['focaccia', deletedId] })

            const syncedFocaccias = queryClient.getQueryData<FocacciaItem[]>(['focaccias']) ?? []
            ProductCache.write(syncedFocaccias)
        },
        onSettled: (_, __, deletedId) => {
            void queryClient.invalidateQueries({ queryKey: ['focaccias'] })
            void queryClient.invalidateQueries({ queryKey: ['featuredFocaccias'] })
            if (deletedId) queryClient.removeQueries({ queryKey: ['focaccia', deletedId] })
        },
    })
}
