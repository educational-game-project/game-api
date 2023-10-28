import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Images } from '../model/schema/subtype/images.subtype';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
    constructor(
        @InjectModel(Images.name) private readonly imageModel: Model<Images>,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) { }

    private HOST = this.configService.get<number>('HOST');

    async define(files: Array<any>): Promise<any> {
        const media = Promise.all(files?.map(async (file) => {
            const link = `${this.HOST}public/${file.filename}`;
            const uploaded = await this.imageModel.create({
                originalname: file.originalname,
                filename: file.filename,
                fileLink: link,
                mimeType: file.mimetype,
            })

            return uploaded;
        }))

        return media;
    }
}