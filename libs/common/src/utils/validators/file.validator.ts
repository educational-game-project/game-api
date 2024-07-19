import { BadRequestException } from "@nestjs/common";

export const imageFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(|JPG|jpg|jpeg|png|PNG)$/i)) {
    return callback(
      new BadRequestException("Only image files are allowed!"),
      false,
    );
  }
  callback(null, true);
};

export const limitImageUpload = (maxFile?: number) => {
  return {
    fileSize: maxFile ?? 10 * 1024 * 1024,
  };
};
