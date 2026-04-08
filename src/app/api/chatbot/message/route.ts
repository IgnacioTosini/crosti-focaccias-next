import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
const API_HEADERS = {
    "Content-Type": "application/json",
    ...(process.env.INTERNAL_API_KEY
        ? { "X-API-KEY": process.env.INTERNAL_API_KEY }
        : {}),
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_BASE_URL}/chatbot/message`, {
            method: "POST",
            headers: API_HEADERS,
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying chatbot request:", error);
        return NextResponse.json(
            {
                message: "Error communicating with chatbot",
                success: false,
            },
            { status: 500 }
        );
    }
}
