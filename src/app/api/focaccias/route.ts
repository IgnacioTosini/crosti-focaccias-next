import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { fetchServerFocaccias } from "@/services/FocacciaServerService";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
const API_HEADERS = process.env.INTERNAL_API_KEY
    ? { "X-API-KEY": process.env.INTERNAL_API_KEY }
    : undefined;

export const revalidate = 1800;
export const maxDuration = 10;

const backend = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: API_HEADERS,
    timeout: 8000,
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const isFeatured = searchParams.get("featured") === "true";
    const focaccias = await fetchServerFocaccias({ featured: isFeatured });

    if (!focaccias) {
        return NextResponse.json(
            { error: "No pudimos obtener las focaccias en este momento" },
            { status: 503 }
        );
    }

    return NextResponse.json(
        { data: focaccias },
        {
            headers: {
                "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
            },
        }
    );
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
