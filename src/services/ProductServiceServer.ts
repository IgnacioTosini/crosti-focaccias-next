import axios from "axios";
import type { FocacciaItem, FocacciaCreate } from "../types";

const api = axios.create({
    baseURL: "/api",
});

export class ProductServiceServer {
    static async createFocaccia(focaccia: FocacciaCreate) {
        const { data } = await api.post("/focaccias", focaccia);
        return data;
    }

    static async updateFocaccia(id: number, focaccia: FocacciaItem) {
        const { data } = await api.put(`/focaccias/${id}`, focaccia);
        return data;
    }

    static async deleteFocaccia(id: number) {
        const { data } = await api.delete(`/focaccias/${id}`);
        return data;
    }
}
