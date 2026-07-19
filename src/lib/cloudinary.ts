// ============================================================================
// Aurora & Co. — Cloudinary configuration.
// Used by the admin media library for image/video uploads.
// ============================================================================

export const cloudinaryConfig = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret
  );
}

// Build a Cloudinary upload URL for unsigned uploads (client-side).
// Uses an unsigned upload preset — create one in Cloudinary Dashboard → Settings → Upload.
export function getCloudinaryUploadUrl(preset = "aurora_unsigned"): string {
  const cloud = cloudinaryConfig.cloud_name;
  if (!cloud) throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  return `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`;
}

// Build the URL for a Cloudinary asset with optional transformations.
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "limit";
    quality?: "auto" | number;
    format?: "auto" | "webp" | "jpg" | "png";
    gravity?: "auto" | "face" | "center";
  } = {}
): string {
  const cloud = cloudinaryConfig.cloud_name;
  if (!cloud) return publicId; // fallback to raw URL
  const transforms: string[] = [];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);
  const transformStr = transforms.length > 0 ? transforms.join(",") + "/" : "";
  return `https://res.cloudinary.com/${cloud}/image/upload/${transformStr}${publicId}`;
}

// Server-side: generate a signature for signed uploads.
// Use this in an API route to allow authenticated uploads.
export async function generateCloudinarySignature(
  paramsToSign: Record<string, string | number>
): Promise<string> {
  const crypto = await import("crypto");
  const apiSecret = cloudinaryConfig.api_secret;
  if (!apiSecret) throw new Error("CLOUDINARY_API_SECRET is not set");
  const sorted = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(sorted + apiSecret).digest("hex");
}
