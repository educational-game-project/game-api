import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FileUploader {
  private logger = new Logger(FileUploader.name);
  private CLOUD_NAME = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
  private API_KEY = this.configService.get<string>('CLOUDINARY_API_KEY');
  private API_SECRET = this.configService.get<string>('CLOUDINARY_API_SECRET');

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.API_KEY,
      api_secret: this.API_SECRET,
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      const { filename } = file;
      const fileBuffer = Buffer.from(file.buffer);
      let res: any = await this.uploadFileToCloudinary(fileBuffer, filename);

      return res?.secure_url;
    } catch (error) {
      this.logger.error(this.uploadFile.name);
      throw new HttpException(
        error?.response ?? error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async uploadFileToCloudinary(
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<any> {
    try {
      const uploadResult = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto',
              public_id: `game/${fileName}`,
              filename_override: fileName,
              unique_filename: true,
              overwrite: true,
            },
            (error, uploadResult) => {
              return resolve(uploadResult);
            },
          )
          .end(fileBuffer);
      });
      return uploadResult;
    } catch (error) {
      this.logger.error(this.uploadFileToCloudinary.name);
      console.error('Error uploading to Cloudinary:', error);
      throw new HttpException(
        error?.response ?? error?.message ?? error,
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
