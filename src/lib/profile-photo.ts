export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export function validateProfilePhoto(file: { type: string; size: number }) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Escolha uma foto JPG, PNG ou WebP.';
  if (file.size > PROFILE_PHOTO_MAX_BYTES) return 'A foto deve ter até 5 MB.';
  if (file.size === 0) return 'Esta foto está vazia. Escolha outra imagem.';
  return null;
}

export async function prepareProfilePhoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível preparar sua foto.');
    const side = Math.min(bitmap.width, bitmap.height);
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 512, 512);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Não foi possível preparar sua foto.')), 'image/webp', 0.85));
  } finally {
    bitmap.close();
  }
}