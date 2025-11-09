import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import logger from "../config/logger.config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

interface uploadFile {
  buffer: Buffer;
}
export const uploadMediaToCloudianry = (
  file: uploadFile
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) {
          logger.error("Error while uploading media to cloudinary", error);
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("unknown error occured during cloudinary"));
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const deleteMediaFromCloudinary = async (
  publicId: string
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Media deleted successfuly from cloud stroage", publicId);
    return result;
  } catch (error) {
    logger.error("Error deleting media from cludinary", error);
    throw error;
  }
};
