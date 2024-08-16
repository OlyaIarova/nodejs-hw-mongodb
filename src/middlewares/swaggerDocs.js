import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';//бібліотека для інтеграції Swagger UI з Express
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString()); //дня завантаження і відображення документації Swagger з файлу
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)]; //функція повертає масив, який містить middleware для Express (swaggerUI.serve) і виклик налаштування Swagger UI (swaggerUI.setup(swaggerDoc))
  } catch (err) {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};


//код призначений для налаштування документації API за допомогою Swagger