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
    });
};

export const usePedido = (id: number) => {
    return useQuery({
        queryKey: ["pedido", id],
        queryFn: async () => {
            const res = await pedidoService.getById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useCreatePedido = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pedidoService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pedidos"] });
            useCartStore.getState().clearCart();
        },
    });
};

export const useDeletePedido = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pedidoService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pedidos"] });
        },
    });
};
