import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const editFilename = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	// console.table(file);
	const randomName = Array(4)
	.fill(null)
	.map(() => Math.round(Math.random() * 16).toString(16))
	.join('');
	callback(null, `${randomName}${fileExtName}`);
}

export const imageFileFilter = (req, file, callback) => {
	// console.table(file);
    if (!file.mimetype.includes('image')) {
        return callback(new BadRequestException('Provide a valid image'), false);
    }
    callback(null, true);
};