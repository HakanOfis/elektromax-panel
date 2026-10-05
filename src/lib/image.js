// Verkleint een gekozen foto in de browser en zet hem om naar WebP (of JPEG als WebP niet kan).
export async function prepareImage(file, maxSize = 1600) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  let blob = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));
  let ext = "webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    ext = "jpg";
  }
  const base64 = await new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result).split(",")[1]);
    fr.readAsDataURL(blob);
  });
  return { base64, ext, previewUrl: URL.createObjectURL(blob), size: blob.size, width: w, height: h };
}
