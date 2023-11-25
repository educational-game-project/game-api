import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from '../model/schema/subtype/images.subtype';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
    constructor(
        @InjectModel(Image.name) private readonly imageModel: Model<Image>,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) { }

    private readonly logger = new Logger(ImagesService.name);

    private HOST = this.configService.get<number>('HOST');

    async define(files: Array<any>): Promise<any> {
        try {
            const media = await Promise.all(files?.map(async (file) => {
                const link = `${this.HOST}public/${file.filename}`;
                const uploaded = await this.imageModel.create({
                    originalname: file.originalname,
                    filename: file.filename,
                    fileLink: link,
                    mimeType: file.mimetype,
                    size: file?.size,
                })

                return uploaded;
            }))

            return media;
        } catch (error) {
            this.logger.error(this.define.name);
            console.log(error);
            throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(files: Array<any>): Promise<any> {
        try {
            const media = await Promise.all(files.map(async (item) => {
                let image = await this.imageModel.findOne({ _id: item._id });
                if (image) {
                    await this.unlink(image.filename)
                    image.deletedAt = new Date();
                    await image.save();
                    return image
                }
            }))

            return media;
        } catch (error) {
            this.logger.error(this.delete.name);
            console.log(error);
            throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async unlink(filename: string): Promise<any> {
        try {
            const deletedMedia: any = await fs.unlink(join(__dirname, `../public/${filename}`), (err) => {
                if (err) throw new InternalServerErrorException(err);
                return true;
            })
            return !!deletedMedia;
        } catch (error) {
            this.logger.error(this.delete.name);
            console.log(error);
            throw new InternalServerErrorException({ message: error.message });
        }
    }
}