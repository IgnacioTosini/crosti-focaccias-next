import { useState, useCallback } from 'react';

export interface ImageOptimizationOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
    maxSizeKB?: number;
}

export interface OptimizedImageResult {
    file: File;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    preview: string;
}

export const useImageOptimizer = () => {
    const [isOptimizing, setIsOptimizing] = useState(false);

    const optimizeImage = useCallback(async (
        file: File,
        options: ImageOptimizationOptions = {}
    ): Promise<OptimizedImageResult> => {
        // Validar que el archivo no esté vacío
        if (!file || file.size === 0 || !file.name) {
            throw new Error('Archivo inválido o vacío');
        }

        setIsOptimizing(true);

        const {
            maxWidth = 1920,
            maxHeight = 1080,
            quality = 0.9,
            format = 'webp',
            maxSizeKB = 300
        } = options;

        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                try {
                    let { width, height } = img;

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    canvas.width = width;
                    canvas.height = height;

                    if (ctx) {
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, width, height);
                    }

                    const toBlob = (q: number): Promise<Blob> =>
                        new Promise<Blob>((res) =>
                            canvas.toBlob((b) => res(b!), `image/${format}`, q)
                        );

                    // Búsqueda binaria para encontrar la calidad óptima más alta
                    // que respete el límite de tamaño
                    const optimizeQuality = async (initialQuality: number): Promise<Blob> => {
                        const initial = await toBlob(initialQuality);

                        if (initial.size >= file.size) {
                            return new Blob([file], { type: file.type });
                        }

                        if (initial.size <= maxSizeKB * 1024) return initial;

                        let low = 0.1, high = initialQuality, best = initial;

                        for (let i = 0; i < 8; i++) {
                            const mid = (low + high) / 2;
                            const candidate = await toBlob(mid);
                            if (candidate.size <= maxSizeKB * 1024) {
                                best = candidate;
                                low = mid;
                            } else {
                                high = mid;
                            }
                        }

                        return best;
                    };

                    optimizeQuality(quality).then((optimizedBlob) => {
                        // Crear el archivo optimizado
                        const optimizedFile = new File(
                            [optimizedBlob],
                            file.name.replace(/\.[^/.]+$/, `.${format === 'jpeg' ? 'jpg' : format}`),
                            {
                                type: `image/${format}`,
                                lastModified: Date.now(),
                            }
                        );

                        // Crear preview URL
                        const preview = URL.createObjectURL(optimizedBlob);

                        // Verificar si realmente se optimizó o si es mejor usar el original
                        let finalFile = optimizedFile;
                        let finalSize = optimizedBlob.size;
                        let finalPreview = preview;

                        // Si la imagen optimizada es más grande que la original, usar la original
                        if (optimizedBlob.size >= file.size) {
                            finalFile = file;
                            finalSize = file.size;
                            URL.revokeObjectURL(preview);
                            finalPreview = URL.createObjectURL(file);
                        }

                        // Asegurar que el ratio de compresión sea correcto
                        const compressionRatio = file.size > finalSize
                            ? Math.round(((file.size - finalSize) / file.size) * 100)
                            : 0;

                        const result: OptimizedImageResult = {
                            file: finalFile,
                            originalSize: file.size,
                            optimizedSize: finalSize,
                            compressionRatio,
                            preview: finalPreview
                        };

                        setIsOptimizing(false);
                        resolve(result);
                    }).catch(reject);

                } catch (error) {
                    setIsOptimizing(false);
                    reject(error);
                }
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                setIsOptimizing(false);
                reject(new Error('Error al cargar la imagen'));
            };

            img.src = objectUrl;
        });
    }, []);

    const optimizeMultipleImages = useCallback(async (
        files: FileList | File[],
        options?: ImageOptimizationOptions
    ): Promise<OptimizedImageResult[]> => {
        setIsOptimizing(true);

        const fileArray = Array.from(files);
        const results: OptimizedImageResult[] = [];

        try {
            for (const file of fileArray) {
                if (file.type.startsWith('image/')) {
                    const result = await optimizeImage(file, options);
                    results.push(result);
                }
            }
            return results;
        } finally {
            setIsOptimizing(false);
        }
    }, [optimizeImage]);

    // Función para limpiar URLs de preview
    const cleanupPreviews = useCallback((results: OptimizedImageResult[]) => {
        results.forEach(result => {
            if (result.preview) {
                URL.revokeObjectURL(result.preview);
            }
        });
    }, []);

    // Función para obtener información de una imagen sin optimizarla
    const getImageInfo = useCallback((file: File): Promise<{ width: number; height: number; size: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    size: file.size
                });
            };
            img.onerror = () => reject(new Error('Error al cargar la imagen'));
            img.src = URL.createObjectURL(file);
        });
    }, []);

    return {
        optimizeImage,
        optimizeMultipleImages,
        cleanupPreviews,
        getImageInfo,
        isOptimizing
    };
};