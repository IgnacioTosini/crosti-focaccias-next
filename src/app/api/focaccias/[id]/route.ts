import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
const API_HEADERS = process.env.INTERNAL_API_KEY
    ? { "X-API-KEY": process.env.INTERNAL_API_KEY }
    : undefined;

const backend = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: API_HEADERS,
    timeout: 8000,
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await fetch(`${BACKEND_BASE_URL}/focaccias/${id}`, {
            headers: API_HEADERS,
            next: {
                revalidate: 60 * 30,
                tags: ["focaccias"],
            },
            cache: "force-cache",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Error fetching focaccia" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching focaccia:", error);
        return NextResponse.json(
            { error: "Error fetching focaccia" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;

        const { data } = await backend.put(`/focaccias/${id}`, body);
        revalidateTag("focaccias", "max");

        return NextResponse.json(data);
    } catch (error: unknown) {
        const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
        console.error(axiosError.response?.data || axiosError.message);
        return NextResponse.json(
            { error: "Error updating focaccia" },
            { status: axiosError.response?.status || 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { data } = await backend.delete(`/focaccias/${id}`);
        revalidateTag("focaccias", "max");

        return NextResponse.json(data);
    } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };

        return NextResponse.json(
            { error: "Error deleting focaccia" },
            { status: axiosError.response?.status || 500 }
        );
    }
}
