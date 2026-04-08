import type { FocacciaItem } from "@/types";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
const API_HEADERS = process.env.INTERNAL_API_KEY
    ? { "X-API-KEY": process.env.INTERNAL_API_KEY }
    : undefined;

const MENU_REVALIDATE_TIME = 60 * 30;
const MENU_FETCH_TIMEOUT_MS = 8500;

const serverMenuCache = new Map<"all" | "featured", FocacciaItem[]>();

const unwrapResponse = <T>(payload: T | { data: T }) => {
    if (payload && typeof payload === "object" && "data" in payload) {
        return payload.data;
    }

    return payload as T;
};

export async function fetchServerFocaccias(
    options: { featured?: boolean } = {}
): Promise<FocacciaItem[] | undefined> {
    const { featured = false } = options;
    const cacheKey = featured ? "featured" : "all";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MENU_FETCH_TIMEOUT_MS);

    try {
        const endpoint = featured ? "/focaccias/featured" : "/focaccias";
        const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
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
            return serverMenuCache.get(cacheKey);
        }

        const data = await response.json();
        const focaccias = unwrapResponse<FocacciaItem[]>(data);

        if (Array.isArray(focaccias) && focaccias.length > 0) {
            serverMenuCache.set(cacheKey, focaccias);
        }

        return focaccias;
    } catch (error) {
        console.error("Error al precargar el menú en el servidor:", error);
        return serverMenuCache.get(cacheKey);
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function getServerFocaccias(): Promise<FocacciaItem[] | undefined> {
    return fetchServerFocaccias();
}
