import { cloudinary, cloudinaryUploadFolder } from "@/lib/cloudinary";

type UploadedScreenshot = {
  publicId: string;
  secureUrl: string;
};

export class CloudinaryConfigurationError extends Error {
  constructor() {
    super("Cloudinary environment variables are required for uploads.");
    this.name = "CloudinaryConfigurationError";
  }
}

export async function uploadScreenshotToCloudinary({
  file,
  projectId,
}: {
  file: File;
  projectId: string;
}): Promise<UploadedScreenshot> {
  assertCloudinaryConfigured();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `${cloudinaryUploadFolder}/projects/${projectId}`,
    resource_type: "image",
    use_filename: true,
    unique_filename: true,
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
  };
}

export async function destroyCloudinaryImage(publicId: string) {
  assertCloudinaryConfigured();

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Cloudinary could not remove the image.");
  }
}

export function assertCloudinaryConfigured() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new CloudinaryConfigurationError();
  }
}
