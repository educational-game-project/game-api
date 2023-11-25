import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const editFileImageName = (req, file, callback) => {
    const fileExtName = extname(file.originalname);
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 10).toString(10))
        .join('');
    callback(null, `${randomName}${fileExtName}`);
};

// Allow image files
export const imageAndPdfFilter = (req, file, callback: (error: Error, acceptFile: boolean) => any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|PNG)$/)) {
        return callback(
            new BadRequestException('Only image or pdf files are allowed!'),
            false,
        );
    }
    callback(null, true);
};

// Allow image and video files
export const imageAndVideoFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|3gp|avi|mov)$/i)) {
        return callback(
            new BadRequestException('Only image or video files are allowed!'),
            false,
        );
    }
    callback(null, true);
};

export const imageFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(|JPG|jpg|jpeg|png|PNG)$/i)) {
        return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
        );
    }
    callback(null, true);
};

export const videoFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('video/')) {
        // Accept the file
        callback(null, true);
    } else {
        // Reject the file
        callback(new Error('Only video files are allowed.'), false);
    }
};


export const limitImageUpload = (maxFile?: number) => {
    return {
        fileSize: maxFile ?? 10 * 1024 * 1024
    }
}