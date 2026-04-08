import axios from "axios";
import type { FocacciaItem } from "@/types";

const PRODUCT_CACHE_KEY = "crosti-focaccias-cache";

const api = axios.create({
    baseURL: "/api",
    timeout: 8000,
});

const unwrapResponse = <T>(payload: T | { data: T }) => {
    if (payload && typeof payload === "object" && "data" in payload) {
        return payload.data;
    }

    return payload as T;
};

const readCachedFocaccias = (): FocacciaItem[] => {
    if (typeof window === "undefined") return [];

    try {
        const cachedValue = window.localStorage.getItem(PRODUCT_CACHE_KEY);
        return cachedValue ? JSON.parse(cachedValue) : [];
    } catch (error) {
        console.error("No se pudo leer el cache de focaccias:", error);
        return [];
    }
};

const writeCachedFocaccias = (focaccias: FocacciaItem[]) => {
    if (typeof window === "undefined" || focaccias.length === 0) return;

    try {
        window.localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(focaccias));
    } catch (error) {
        console.error("No se pudo guardar el cache de focaccias:", error);
    }
};

export class ProductService {
    static async getFocaccias() {
        try {
            const { data } = await api.get("/focaccias");
            const focaccias = unwrapResponse<FocacciaItem[]>(data);

            writeCachedFocaccias(focaccias);
            return focaccias;
        } catch (error) {
            const cachedFocaccias = readCachedFocaccias();

            if (cachedFocaccias.length > 0) {
                return cachedFocaccias;
            }

            throw error;
        }
    }

    static async getFocacciaById(id: number) {
        try {
            const { data } = await api.get(`/focaccias/${id}`);
            return unwrapResponse(data);
        } catch (error) {
            const cachedFocaccias = readCachedFocaccias();
            const cachedFocaccia = cachedFocaccias.find((focaccia) => focaccia.id === id);

            if (cachedFocaccia) {
                return cachedFocaccia;
            }

            throw error;
        }
    }

    static async getFeaturedFocaccias() {
        try {
            const { data } = await api.get("/focaccias", {
                params: { featured: true },
            });

            const focaccias = unwrapResponse<FocacciaItem[]>(data);
            if (focaccias.length > 0) {
                writeCachedFocaccias(focaccias);
            }

            return focaccias;
        } catch {
            const cachedFocaccias = readCachedFocaccias();
            return cachedFocaccias.filter((focaccia) => focaccia.featured);
        }
    }
}
