import axios from "axios";
import type { Pedido, PedidoRequest, ApiResponse } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_PEDIDOS_URL || "http://localhost:8080/api/pedidos";

export const pedidoService = {
    create: async (data: PedidoRequest): Promise<ApiResponse<Pedido>> => {
        const res = await axios.post(`${BASE_URL}`, data);
        return res.data;
    },

    getAll: async (): Promise<ApiResponse<Pedido[]>> => {
        const res = await axios.get(`${BASE_URL}`);
        return res.data;
    },

    getById: async (id: number): Promise<ApiResponse<Pedido>> => {
        const res = await axios.get(`${BASE_URL}/${id}`);
        return res.data;
    },

    delete: async (id: number): Promise<ApiResponse<Pedido>> => {
        const res = await axios.delete(`${BASE_URL}/${id}`);
        return res.data;
    },

    getByPhone: async (
        phone: string
    ): Promise<ApiResponse<Pedido[]>> => {
        const res = await axios.get(
            `${BASE_URL}/buscar/telefono/${encodeURIComponent(phone)}`
        );
        return res.data;
    },
};
