import { NextRequest } from "next/server";
import axios from "axios";

export async function DELETE(req: NextRequest) {
    const publicId = req.nextUrl.searchParams.get("publicId");

    if (!publicId) {
        return Response.json({ error: "Missing publicId" }, { status: 400 });
    }

    const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cloudinary/upload?publicId=${encodeURIComponent(publicId)}`,
        {
            headers: {
                "X-API-KEY": process.env.INTERNAL_API_KEY!,
            },
        }
    );

    return Response.json(response.data);
}
