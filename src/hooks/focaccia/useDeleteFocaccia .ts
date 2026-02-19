import { ProductServiceServer } from "@/services/ProductServiceServer"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteFocaccia = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ProductServiceServer.deleteFocaccia,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['focaccias'] })
        }
    })
}
