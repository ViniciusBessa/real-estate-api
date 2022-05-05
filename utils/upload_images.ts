import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import { BadRequestError } from '../errors';

const cloudinaryUploader = cloudinary.v2.uploader;

const uploadFromBuffer = (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryUploader.upload_stream(
      { folder: 'real_state' },
      (err: any, result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

const checkImages = (files: Express.Multer.File[]) => {
  const allowedExtensions = ['jpg', 'png'];
  const oneMegaByte = 1024 * 1024;

  files.forEach((file: Express.Multer.File) => {
    // Getting the file extension
    const imageExtension: string | undefined = file.originalname
      .split('.')
      .at(-1);

    // Throwing an error if the file extension is not allowed
    if (!allowedExtensions.includes(imageExtension as string)) {
      throw new BadRequestError(
        `Imagens com a extensão .${imageExtension} não são permitidas`
      );
    }
    // Throwing an error if the file size is bigger than one megabyte 
    else if (file.size > oneMegaByte) {
      throw new BadRequestError('Só são permitidos arquivos de até um megabyte');
    }
  });
};

const uploadImages = async (files: any) => {
  if (!files) {
    throw new BadRequestError('Por favor, adicione imagens');
  }

  // Checking if the files are valid
  checkImages(files);

  // Array where all the uploaded images URLs are stored
  const urlImages: string[] = [];

  // Wrapping the upload in a Promise
  await Promise.all(
    files.map(async (file: Express.Multer.File) => {
      const uploadedImage: any = await uploadFromBuffer(file);
      urlImages.push(uploadedImage.secure_url);
    })
  );
  return urlImages;
};

export default uploadImages;
export { uploadFromBuffer, checkImages };
