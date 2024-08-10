import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

//Налаштування сховища файлів
const storage = multer.diskStorage({//дозволяє зберігати файли на диску сервера
  destination: function (req, file, cb) {//Визначає місце на диску
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) { //Визначає ім'я файлу, який буде збережений
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });

//код дозволяє завантажувати файли на сервер і зберігати їх у тимчасовій директорії з унікальними іменами
