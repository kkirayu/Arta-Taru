const DEFAULT_MAX_BYTES = 4 * 1024 * 1024;
const DEFAULT_MAX_DIMENSION = 1600;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal membaca gambar.'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Gagal mengompres gambar.'))),
      'image/jpeg',
      quality
    );
  });
}

/**
 * Compress an image in the browser so it fits under the upload limit.
 * Vercel rejects request bodies over 4.5 MB, so we target 4 MB by default.
 */
export async function compressImage(
  file: File,
  maxBytes: number = DEFAULT_MAX_BYTES,
  maxDimension: number = DEFAULT_MAX_DIMENSION
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Format file tidak didukung.');
  }

  // Animated GIFs cannot be redrawn on a canvas without losing animation.
  if (file.type === 'image/gif') {
    if (file.size > maxBytes) {
      throw new Error(`File "${file.name}" melebihi batas 4 MB.`);
    }
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Browser tidak mendukung kompresi gambar.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let quality = 0.85;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > maxBytes && quality > 0.4) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  if (blob.size > maxBytes) {
    throw new Error(`File "${file.name}" tetap melebihi 4 MB setelah dikompres.`);
  }

  const name = `${file.name.replace(/\.[^.]+$/, '') || 'gambar'}.jpg`;

  return new File([blob], name, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}
