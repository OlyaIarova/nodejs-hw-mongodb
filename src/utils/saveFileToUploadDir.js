import path from 'node:path';
import fs from 'node:fs/promises';

import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(//переміщуємо файл з тимчасової директорії в остаточну
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
};

//імпортує необхідні модулі, визначає константи для тимчасової та остаточної директорій завантаження файлів, та створює функцію для збереження файлів у директорію завантаження
