import { serverAxios } from "@/lib/serverAxios";

export class ImageServerService {
    static async deleteImage(publicId: string) {
        const { data } = await serverAxios.delete(
            `/cloudinary/upload?publicId=${encodeURIComponent(publicId)}`
        );
        return data;
    }
}
