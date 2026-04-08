import type { FocacciaItem } from "@/types";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
const API_HEADERS = process.env.INTERNAL_API_KEY
    ? { "X-API-KEY": process.env.INTERNAL_API_KEY }
    : undefined;

const MENU_REVALIDATE_TIME = 60 * 30;
const MENU_FETCH_TIMEOUT_MS = 4000;

const unwrapResponse = <T>(payload: T | { data: T }) => {
    if (payload && typeof payload === "object" && "data" in payload) {
        return payload.data;
    }

    return payload as T;
};

export async function getServerFocaccias(): Promise<FocacciaItem[] | undefined> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MENU_FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/focaccias`, {
            headers: API_HEADERS,
            next: {
                revalidate: MENU_REVALIDATE_TIME,
                tags: ["focaccias"],
            },
            cache: "force-cache",
            signal: controller.signal,
        });

        if (!response.ok) {
            console.error("No se pudieron precargar las focaccias:", response.status);
            return undefined;
        }

        const data = await response.json();
        return unwrapResponse<FocacciaItem[]>(data);
    } catch (error) {
        console.error("Error al precargar el menú en el servidor:", error);
        return undefined;
    } finally {
        clearTimeout(timeoutId);
    }
}
