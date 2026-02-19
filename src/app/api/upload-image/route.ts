import { NextRequest } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/cloudinary/upload`)

    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cloudinary/upload`,
        formData,
        {
            headers: {
                "X-API-KEY": process.env.INTERNAL_API_KEY!,
            },
        }
    );

    return Response.json(response.data);
}
