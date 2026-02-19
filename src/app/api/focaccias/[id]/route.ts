import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const backend = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api",
    headers: {
        "X-API-KEY": process.env.INTERNAL_API_KEY,
    },
});

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;

        const { data } = await backend.put(`/focaccias/${id}`, body);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        return NextResponse.json(
            { error: "Error updating focaccia" },
            { status: error.response?.status || 500 }
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

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Error deleting focaccia" },
            { status: error.response?.status || 500 }
        );
    }
}
