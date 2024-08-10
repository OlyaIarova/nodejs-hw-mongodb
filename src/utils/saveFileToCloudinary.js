import cloudinary  from 'cloudinary'; //для завантаження та обробки зображен
//import fs from 'node:fs/promises'; //для роботи з файловою системою

import { env } from './env.js'; 
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path); //завантаження файлу upload, повертає інформацію про завантажений файл
 // await fs.unlink(file.path); //видаляє локальний файл після завантаження
  return response.secure_url; //повертає захищений URL завантаженого файлу
};

//забезпечує ефективне керування завантаженням зображень, зберігаючи їх у хмарному сервісі та очищаючи локальні файли після завантаження
