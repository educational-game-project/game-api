import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Image } from "../model/schema/subtype/images.subtype";
import { Model } from "mongoose";
import * as fs from "fs";
import { extname, join } from "path";
import { FileUploader } from "../utils/fileUploader.util";

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @Inject(FileUploader) private uploader: FileUploader,
  ) { }

  private readonly logger = new Logger(ImagesService.name);

  async define(files: Array<Express.Multer.File>): Promise<any> {
    try {
      const media = await Promise.all(
        files?.map(async (file) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file?.originalname);
          file.filename = `game_${uniqueSuffix}`;

          const link = await this.uploader.uploadFile(file);
          const uploaded = await this.imageModel.create({
            originalName: file.originalname,
            fileName: file.filename + ext,
            fileLink: link,
            mimeType: file.mimetype,
            size: file?.size,
          });

          return uploaded;
        }),
      );

      return media;
    } catch (error) {
      this.logger.error(this.define.name);
      console.log(error?.message);;
      throw new HttpException(
        error?.response ?? error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(files: Array<any>): Promise<any> {
    try {
      const media = await Promise.all(
        files.map(async (item) => {
          let image = await this.imageModel.findOne({ _id: item._id });
          if (image) {
            await this.uploader.deleteFromCloudinary(image);
            image.deletedAt = new Date();
            await image.save();
            return image;
          }
        }),
      );

      return media;
    } catch (error) {
      this.logger.error(this.delete.name);
      console.log(error?.message);;
      throw new HttpException(
        error?.response ?? error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async unlink(filename: string): Promise<any> {
    try {
      const deletedMedia: any = await fs.unlink(
        join(__dirname, `../public/${filename}`),
        (err) => {
          if (err) throw new InternalServerErrorException(err);
          return true;
        },
      );
      return !!deletedMedia;
    } catch (error) {
      this.logger.error(this.delete.name);
      console.log(error?.message);;
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
