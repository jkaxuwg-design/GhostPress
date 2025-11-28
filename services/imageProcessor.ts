/// <reference lib="dom" />
interface CompressionOptions {
  quality: number; // 0 to 1
  scale: number; // 0 to 1
  format: 'image/webp' | 'image/jpeg' | 'image/png';
}

export const compressImage = async (
  file: File,
  options: CompressionOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement('canvas');
      let width = img.width * options.scale;
      let height = img.height * options.scale;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Note: Strip metadata is implicit here because Canvas redraws pixels only.
      // Exif data is lost by default when drawing to canvas, satisfying the privacy requirement.

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        options.format,
        options.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};