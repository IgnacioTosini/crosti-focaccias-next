import { deleteFocacciaAction } from "@/app/actions/focaccia.actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { FocacciaItem } from "@/types"

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

            queryClient.invalidateQueries({ queryKey: ['focaccias'], refetchType: 'inactive' })
            queryClient.invalidateQueries({ queryKey: ['featuredFocaccias'], refetchType: 'inactive' })
        }
    })
}
