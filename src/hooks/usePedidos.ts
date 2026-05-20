import { pedidoService } from "@/services/PedidoService";
import { useCartStore } from "@/store/cart.store";
import type { Pedido, PedidoStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePedidos = () => {
    return useQuery({
        queryKey: ["pedidos"],
        queryFn: async () => {
            const res = await pedidoService.getAll();
            return res.data;
        },
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchInterval: 30_000,
        refetchIntervalInBackground: false,
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

            useCartStore.getState().clearCart();
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
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
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
        },
    });
};

export const useUpdatePedidoStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: PedidoStatus }) => pedidoService.updateStatus(id, status),
        onSuccess: (response, variables) => {
            const updatedPedido = response.data;

            queryClient.setQueryData(["pedidos"], (current: unknown) => {
                const currentPedidos = Array.isArray(current) ? (current as Pedido[]) : [];
                return currentPedidos.map((pedido) =>
                    pedido.id !== variables.id ? pedido : { ...pedido, ...updatedPedido }
                );
            });
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
        },
    });
};