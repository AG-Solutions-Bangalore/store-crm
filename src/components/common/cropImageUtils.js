export default function getCroppedImg(imageSrc, pixelCrop, cropSize) {
  const canvas = document.createElement("canvas");
  canvas.width = cropSize.width;
  canvas.height = cropSize.height;
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        cropSize.width,
        cropSize.height
      );
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        blob.name = "cropped.jpeg";
        const fileUrl = window.URL.createObjectURL(blob);
        resolve({ blob, fileUrl });
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
}
