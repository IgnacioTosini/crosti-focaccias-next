import { pedidoService } from "@/services/PedidoService";
import { useCartStore } from "@/store/cart.store";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePedidos = () => {
    return useQuery({
        queryKey: ["pedidos"],
        queryFn: async () => {
            const res = await pedidoService.getAll();
            return res.data;
        },
        // En admin conviene priorizar datos frescos para no mostrar listas cacheadas vacias.
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });
};

export const useCreatePedido = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pedidoService.create,
        onSuccess: (response) => {
            const createdPedido = response.data;

            queryClient.setQueryData(["pedidos"], (current: unknown) => {
                const currentPedidos = Array.isArray(current) ? current : [];
                const withoutCreated = currentPedidos.filter(
                    (pedido: { id?: number }) => pedido.id !== createdPedido.id
                );

                return [createdPedido, ...withoutCreated];
            });

            queryClient.invalidateQueries({ queryKey: ["pedidos"], refetchType: "inactive" });
            useCartStore.getState().clearCart();
        },
    });
};

export const useDeletePedido = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pedidoService.delete,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(["pedidos"], (current: unknown) => {
                const currentPedidos = Array.isArray(current) ? current : [];
                return currentPedidos.filter(
                    (pedido: { id?: number }) => pedido.id !== deletedId
                );
            });

            queryClient.invalidateQueries({ queryKey: ["pedidos"], refetchType: "inactive" });
        },
    });
};
