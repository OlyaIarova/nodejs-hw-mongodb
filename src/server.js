import express from 'express'; //основний модуль для створення сервера
import pino from 'pino-http'; //для логування HTTP-запитів
import cors from 'cors'; //для налаштування політики CORS
import cookieParser from 'cookie-parser';//для обробки cookie

import { env } from './utils/env.js'; //для роботи зі змінними середовища
import { notFoundHandler } from './middlewares/notFoundHandler.js'; //для обробки неіснуючих маршрутів
import { errorHandler } from './middlewares/errorHandler.js'; //для глобальної обробки помилок
import router from './routers/index.js';//основний маршрутизатор

const PORT = Number(env('PORT', '3000')); //номер порту зі змінної середовища PORT, або використовується порт 3000 за замовчуванням

export const setupServer = () => {
  const app = express();

  app.use(express.json()); //для обробки JSON-тіл запитів

  app.use(cors()); //для дозволу крос-доменних запитів

  app.use(cookieParser()); //для обробки cookie

  app.use(pino({ transport: { target: 'pino-pretty' } })); //ля логування HTTP-запитів

  app.use(router); //реєструє маршрутизатор

  app.use(errorHandler); //для глобальної обробки помилок

  app.use('*', notFoundHandler); //для обробки всіх неіснуючих маршрутів

  app.listen(PORT, () => {
    //запускає сервер на порту та виводить повідомлення про успішний запуск у консоль
    console.log(`Server is running on port ${PORT}`);
  });
};
