import axios from "axios";
import type { Pedido, PedidoRequest, PedidoStatus, ApiResponse } from "@/types";
export type { ApiResponse } from "@/types";

const api = axios.create({
    baseURL: "/api/pedidos",
    timeout: 10000,
});

export const pedidoService = {
    create: async (data: PedidoRequest): Promise<ApiResponse<Pedido>> => {
        const res = await api.post("", data);
        return res.data;
    },

    getAll: async (): Promise<ApiResponse<Pedido[]>> => {
        const res = await api.get("");
        return res.data;
    },

    delete: async (id: number): Promise<ApiResponse<Pedido>> => {
        const res = await api.delete(`/${id}`);
        return res.data;
    },

    updateStatus: async (id: number, status: PedidoStatus): Promise<ApiResponse<Pedido>> => {
        const res = await api.patch(`/${id}`, { status });
        return res.data;
    },
};
