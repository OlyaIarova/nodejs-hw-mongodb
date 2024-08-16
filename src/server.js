import express from 'express'; //основний модуль для створення сервера
import pino from 'pino-http'; //для логування HTTP-запитів
import cors from 'cors'; //для налаштування політики CORS
import cookieParser from 'cookie-parser';//для обробки cookie

import { env } from './utils/env.js'; //для роботи зі змінними середовища
import { notFoundHandler } from './middlewares/notFoundHandler.js'; //для обробки неіснуючих маршрутів
import { errorHandler } from './middlewares/errorHandler.js'; //для глобальної обробки помилок
import { swaggerDocs } from './middlewares/swaggerDocs.js';//для налаштування документації API через Swagger
import router from './routers/index.js';//основний маршрутизатор
import { UPLOAD_DIR } from './constants/index.js';//для завантаження файлів

const PORT = Number(env('PORT', '3000')); //номер порту зі змінної середовища PORT, або використовується порт 3000 за замовчуванням

export const setupServer = () => {
  const app = express();

  app.use(express.json()); //для обробки JSON-тіл запитів

  app.use(cors()); //для дозволу крос-доменних запитів

  app.use(cookieParser()); //для обробки cookie

  app.use(pino({ transport: { target: 'pino-pretty' } })); //для логування HTTP-запитів

  app.use('/uploads', express.static(UPLOAD_DIR)); //для обслуговування статичних файлів з директорії UPLOAD_DIR

  app.use('/api-docs', swaggerDocs()); //для налаштування маршрутів для документації API на основі Swagger

  app.use(router); //реєструє маршрутизатор

  app.use(errorHandler); //для глобальної обробки помилок

  app.use('*', notFoundHandler); //для обробки всіх неіснуючих маршрутів

  app.listen(PORT, () => {
    //запускає сервер на порту та виводить повідомлення про успішний запуск у консоль
    console.log(`Server is running on port ${PORT}`);
  });
};



//код створює і налаштовує сервер на базі Express для обробки HTTP-запитів, включаючи маршрути, логування, документацію API через Swagger, обробку помилок і статичні ресурси