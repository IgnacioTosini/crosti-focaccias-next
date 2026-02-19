import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const backend = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api",
    headers: {
        "X-API-KEY": process.env.INTERNAL_API_KEY,
    },
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { data } = await backend.post("/focaccias", body);

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Error creating focaccia" },
            { status: error.response?.status || 500 }
        );
    }
}
