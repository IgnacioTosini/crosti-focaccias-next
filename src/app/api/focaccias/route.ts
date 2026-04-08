import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
const API_HEADERS = process.env.INTERNAL_API_KEY
    ? { "X-API-KEY": process.env.INTERNAL_API_KEY }
    : undefined;

const FETCH_TIMEOUT_MS = 5000;

export const revalidate = 1800;

const backend = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: API_HEADERS,
    timeout: 8000,
});

export async function GET(request: NextRequest) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const { searchParams } = new URL(request.url);
        const isFeatured = searchParams.get("featured") === "true";
        const endpoint = isFeatured ? "/focaccias/featured" : "/focaccias";

        const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
            headers: API_HEADERS,
            next: {
                revalidate: 60 * 30,
                tags: ["focaccias"],
            },
            cache: "force-cache",
            signal: controller.signal,
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Error fetching focaccias" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        const isTimeoutError = error instanceof Error && error.name === "AbortError";

        console.error("Error fetching focaccias:", error);
        return NextResponse.json(
            {
                error: isTimeoutError
                    ? "El servidor tardó demasiado en responder"
                    : "Error fetching focaccias"
            },
            { status: isTimeoutError ? 504 : 500 }
        );
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { data } = await backend.post("/focaccias", body);
        revalidateTag("focaccias", "max");

        return NextResponse.json(data);
    } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };

        return NextResponse.json(
            { error: "Error creating focaccia" },
            { status: axiosError.response?.status || 500 }
        );
    }
}
