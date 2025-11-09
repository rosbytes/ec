import multer from "multer";

export const createMulterUpload = (fileSizeMB: number = 5) => {
  const storage = multer.memoryStorage();
  return multer({
    storage,
    limits: {
      fileSize: fileSizeMB * 1024 * 1024,
    },
  });
};
