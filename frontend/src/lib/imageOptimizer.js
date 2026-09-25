export async function optimizeImage(file, maxSize = 1600, quality = 0.82) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen.');
  }

  const bitmap = await createImageBitmap(file);

  let width = bitmap.width;
  let height = bitmap.height;

  // Redimensionar manteniendo proporción
  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);

    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    bitmap.close();
    throw new Error('No se pudo preparar la imagen.');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('No se pudo comprimir la imagen.'));
        }
      },
      'image/webp',
      quality
    );
  });

  const originalName = file.name.replace(/\.[^/.]+$/, '');

  return new File(
    [blob],
    `${originalName}.webp`,
    {
      type: 'image/webp',
      lastModified: Date.now(),
    }
  );
}