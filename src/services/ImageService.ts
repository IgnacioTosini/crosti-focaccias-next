import axios from "axios";

export type CloudinaryUploadResponse = {
    success: boolean;
    url: string;
    public_id: string;
    error?: string;
    originalSize?: number;
    optimizedSize?: number;
    compressionRatio?: number;
};

export interface ImageOptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
    maxSizeKB?: number;
    enableOptimization?: boolean;
}

export class ImageService {
    /**
     * Optimiza una imagen antes de subirla
     */
    static async optimizeImage(
        file: File,
        options: ImageOptimizationOptions = {}
    ): Promise<{ file: File; stats: { originalSize: number; optimizedSize: number; compressionRatio: number } }> {
        const {
            maxWidth = 1200,
            maxHeight = 800,
            quality = 0.8,
            format = 'jpeg',
            maxSizeKB = 500
        } = options;

        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                try {
                    // Calcular nuevas dimensiones
                    let { width, height } = img;

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width *= ratio;
                        height *= ratio;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx!.drawImage(img, 0, 0, width, height);

                    // Función para ajustar calidad automáticamente
                    const optimizeQuality = async (initialQuality: number): Promise<Blob> => {
                        let currentQuality = initialQuality;
                        let blob: Blob;

                        do {
                            blob = await new Promise<Blob>((resolveBlob) => {
                                canvas.toBlob((b) => resolveBlob(b!), `image/${format}`, currentQuality);
                            });

                            if (blob.size <= maxSizeKB * 1024 || currentQuality <= 0.1) break;
                            currentQuality -= 0.1;
                        } while (currentQuality > 0.1);

                        return blob;
                    };

                    optimizeQuality(quality).then((optimizedBlob) => {
                        const optimizedFile = new File(
                            [optimizedBlob],
                            file.name.replace(/\.[^/.]+$/, `.${format === 'jpeg' ? 'jpg' : format}`),
                            { type: `image/${format}`, lastModified: Date.now() }
                        );

                        const stats = {
                            originalSize: file.size,
                            optimizedSize: optimizedBlob.size,
                            compressionRatio: Math.round(((file.size - optimizedBlob.size) / file.size) * 100)
                        };

                        resolve({ file: optimizedFile, stats });
                    }).catch(reject);

                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            img.src = URL.createObjectURL(file);
        });
    }

    static async uploadImage(
        file: File,
        options: ImageOptimizationOptions = { enableOptimization: true }
    ): Promise<CloudinaryUploadResponse> {
        let fileToUpload = file;

        if (options.enableOptimization && file.type.startsWith("image/")) {
            const optimized = await this.optimizeImage(file, options);
            fileToUpload = optimized.file;
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);

        const response = await axios.post("/api/upload-image", formData);

        return response.data;
    }

    static async deleteImage(publicId: string) {
        const response = await axios.delete(
            `/api/delete-image?publicId=${encodeURIComponent(publicId)}`
        );

        return response.data;
    }
}
